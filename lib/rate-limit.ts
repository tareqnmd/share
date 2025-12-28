interface RateLimitConfig {
	window: number;
	maxRequests: number;
}

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
	'create-file': { window: 60, maxRequests: 10 },
	'update-file': { window: 1, maxRequests: 5 },
	'delete-file': { window: 60, maxRequests: 20 },
	'save-on-unload': { window: 1, maxRequests: 2 },
	'sign-in': { window: 300, maxRequests: 5 },
	'sign-out': { window: 60, maxRequests: 10 },
	'api-global': { window: 60, maxRequests: 100 },
};

const rateLimitStore = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 60000;
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
	resetIn: number;
	limit: number;
}

export function checkRateLimit(identifier: string, action: string): RateLimitResult {
	cleanup();

	const config = RATE_LIMITS[action] || RATE_LIMITS['api-global'];
	const key = `${action}:${identifier}`;
	const now = Date.now();

	const entry = rateLimitStore.get(key);

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

	if (entry.count >= config.maxRequests) {
		const resetIn = Math.ceil((entry.resetTime - now) / 1000);
		return {
			success: false,
			remaining: 0,
			resetIn,
			limit: config.maxRequests,
		};
	}

	entry.count++;
	return {
		success: true,
		remaining: config.maxRequests - entry.count,
		resetIn: Math.ceil((entry.resetTime - now) / 1000),
		limit: config.maxRequests,
	};
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
	return {
		'X-RateLimit-Limit': result.limit.toString(),
		'X-RateLimit-Remaining': result.remaining.toString(),
		'X-RateLimit-Reset': result.resetIn.toString(),
	};
}

export function resetRateLimit(identifier: string, action: string): void {
	const key = `${action}:${identifier}`;
	rateLimitStore.delete(key);
}

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
