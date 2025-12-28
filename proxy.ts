import { checkRateLimit, getRateLimitHeaders, getRateLimitStatus } from '@/lib/rate-limit';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Routes that require rate limiting
const RATE_LIMITED_ROUTES: Record<string, string> = {
	'/api/save-on-unload': 'save-on-unload',
	'/api/health': 'api-global',
};

// Routes that require authentication
const AUTH_REQUIRED_ROUTES = ['/dashboard'];

/**
 * Apply rate limiting to API routes
 */
function applyRateLimit(request: NextRequest): NextResponse | null {
	const pathname = request.nextUrl.pathname;
	const action = RATE_LIMITED_ROUTES[pathname];

	if (!action) return null;

	// Use IP address as identifier for unauthenticated requests
	const ip =
		request.headers.get('x-forwarded-for')?.split(',')[0] ||
		request.headers.get('x-real-ip') ||
		'anonymous';

	const result = checkRateLimit(ip, action);

	if (!result.success) {
		return NextResponse.json(
			{ error: 'Too many requests', retryAfter: result.resetIn },
			{
				status: 429,
				headers: {
					...getRateLimitHeaders(result),
					'Retry-After': result.resetIn.toString(),
				},
			}
		);
	}

	return null;
}

/**
 * Add rate limit headers to response
 */
function addRateLimitHeaders(request: NextRequest, response: NextResponse): NextResponse {
	const pathname = request.nextUrl.pathname;
	const action = RATE_LIMITED_ROUTES[pathname];

	if (!action) return response;

	const ip =
		request.headers.get('x-forwarded-for')?.split(',')[0] ||
		request.headers.get('x-real-ip') ||
		'anonymous';

	// Get status without incrementing (already incremented in applyRateLimit)
	const result = getRateLimitStatus(ip, action);
	const headers = getRateLimitHeaders(result);

	Object.entries(headers).forEach(([key, value]) => {
		response.headers.set(key, value);
	});

	return response;
}

export default async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	// Apply rate limiting for API routes
	if (pathname.startsWith('/api/')) {
		const rateLimitResponse = applyRateLimit(request);
		if (rateLimitResponse) {
			return rateLimitResponse;
		}
	}

	// Check authentication for protected routes
	const isAuthRequired = AUTH_REQUIRED_ROUTES.some((route) => pathname.startsWith(route));

	if (isAuthRequired) {
		const token = await getToken({ req: request });

		if (!token) {
			const signInUrl = new URL('/api/auth/signin', request.url);
			signInUrl.searchParams.set('callbackUrl', request.url);
			return NextResponse.redirect(signInUrl);
		}
	}

	// Add rate limit headers to successful responses
	const response = NextResponse.next();

	if (pathname.startsWith('/api/')) {
		return addRateLimitHeaders(request, response);
	}

	return response;
}

export const config = {
	matcher: [
		// Protected routes requiring auth
		'/dashboard/:path*',
		// API routes for rate limiting
		'/api/:path*',
	],
};
