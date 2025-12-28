/**
 * In-memory rate limiting for serverless environments
 * For production at scale, consider using Redis (Upstash) for distributed rate limiting
 */

interface RateLimitConfig {
	window: number; // Time window in seconds
	maxRequests: number; // Max requests per window
}

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

// Rate limit configurations for different actions
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
	// File operations
	'create-file': { window: 60, maxRequests: 10 }, // 10/min
	'update-file': { window: 1, maxRequests: 5 }, // 5/sec (auto-save)
	'delete-file': { window: 60, maxRequests: 20 }, // 20/min
	'save-on-unload': { window: 1, maxRequests: 2 }, // 2/sec

	// Auth endpoints
	'sign-in': { window: 300, maxRequests: 5 }, // 5/5min
	'sign-out': { window: 60, maxRequests: 10 }, // 10/min

	// General API
	'api-global': { window: 60, maxRequests: 100 }, // 100/min per user
};

// In-memory store (resets on serverless cold start)
// For production, use Redis/Upstash
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
const CLEANUP_INTERVAL = 60000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
	const now = Date.now();
	if (now - lastCleanup < CLEANUP_INTERVAL) return;

	lastCleanup = now;
	for (const [key, entry] of rateLimitStore.entries()) {
		if (now > entry.resetTime) {
			rateLimitStore.delete(key);
		}
	}
}

export interface RateLimitResult {
	success: boolean;
	remaining: number;
	resetIn: number; // seconds until reset
	limit: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (userId, IP, etc.)
 * @param action - Action type from RATE_LIMITS
 * @returns RateLimitResult with success status and metadata
 */
export function checkRateLimit(identifier: string, action: string): RateLimitResult {
	cleanup();

	const config = RATE_LIMITS[action] || RATE_LIMITS['api-global'];
	const key = `${action}:${identifier}`;
	const now = Date.now();

	const entry = rateLimitStore.get(key);

	// No existing entry or window expired
	if (!entry || now > entry.resetTime) {
		const resetTime = now + config.window * 1000;
		rateLimitStore.set(key, { count: 1, resetTime });
		return {
			success: true,
			remaining: config.maxRequests - 1,
			resetIn: config.window,
			limit: config.maxRequests,
		};
	}

	// Within window
	if (entry.count >= config.maxRequests) {
		const resetIn = Math.ceil((entry.resetTime - now) / 1000);
		return {
			success: false,
			remaining: 0,
			resetIn,
			limit: config.maxRequests,
		};
	}

	// Increment counter
	entry.count++;
	return {
		success: true,
		remaining: config.maxRequests - entry.count,
		resetIn: Math.ceil((entry.resetTime - now) / 1000),
		limit: config.maxRequests,
	};
}

/**
 * Generate rate limit headers for HTTP responses
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
	return {
		'X-RateLimit-Limit': result.limit.toString(),
		'X-RateLimit-Remaining': result.remaining.toString(),
		'X-RateLimit-Reset': result.resetIn.toString(),
	};
}

/**
 * Reset rate limit for a specific identifier and action
 * Useful for testing or admin overrides
 */
export function resetRateLimit(identifier: string, action: string): void {
	const key = `${action}:${identifier}`;
	rateLimitStore.delete(key);
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(identifier: string, action: string): RateLimitResult {
	const config = RATE_LIMITS[action] || RATE_LIMITS['api-global'];
	const key = `${action}:${identifier}`;
	const now = Date.now();

	const entry = rateLimitStore.get(key);

	if (!entry || now > entry.resetTime) {
		return {
			success: true,
			remaining: config.maxRequests,
			resetIn: config.window,
			limit: config.maxRequests,
		};
	}

	return {
		success: entry.count < config.maxRequests,
		remaining: Math.max(0, config.maxRequests - entry.count),
		resetIn: Math.ceil((entry.resetTime - now) / 1000),
		limit: config.maxRequests,
	};
}
