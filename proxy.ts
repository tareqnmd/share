import { checkRateLimit, getRateLimitHeaders, getRateLimitStatus } from '@/lib/rate-limit';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMITED_ROUTES: Record<string, string> = {
	'/api/save-on-unload': 'save-on-unload',
	'/api/health': 'api-global',
};

const AUTH_REQUIRED_ROUTES = ['/dashboard'];

function applyRateLimit(request: NextRequest): NextResponse | null {
	const pathname = request.nextUrl.pathname;
	const action = RATE_LIMITED_ROUTES[pathname];

	if (!action) return null;

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

function addRateLimitHeaders(request: NextRequest, response: NextResponse): NextResponse {
	const pathname = request.nextUrl.pathname;
	const action = RATE_LIMITED_ROUTES[pathname];

	if (!action) return response;

	const ip =
		request.headers.get('x-forwarded-for')?.split(',')[0] ||
		request.headers.get('x-real-ip') ||
		'anonymous';

	const result = getRateLimitStatus(ip, action);
	const headers = getRateLimitHeaders(result);

	Object.entries(headers).forEach(([key, value]) => {
		response.headers.set(key, value);
	});

	return response;
}

export default async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	if (pathname.startsWith('/api/')) {
		const rateLimitResponse = applyRateLimit(request);
		if (rateLimitResponse) {
			return rateLimitResponse;
		}
	}

	const isAuthRequired = AUTH_REQUIRED_ROUTES.some((route) => pathname.startsWith(route));

	if (isAuthRequired) {
		const token = await getToken({ req: request });

		if (!token) {
			const signInUrl = new URL('/api/auth/signin', request.url);
			signInUrl.searchParams.set('callbackUrl', request.url);
			return NextResponse.redirect(signInUrl);
		}
	}

	const response = NextResponse.next();

	if (pathname.startsWith('/api/')) {
		return addRateLimitHeaders(request, response);
	}

	return response;
}

export const config = {
	matcher: ['/dashboard/:path*', '/api/:path*'],
};
