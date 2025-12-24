import { AppRoutes } from '@/types/enums';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export default async function proxy(request: NextRequest) {
	const token = await getToken({ req: request });

	if (!token) {
		const signInUrl = new URL('/api/auth/signin', request.url);
		signInUrl.searchParams.set('callbackUrl', request.url);
		return NextResponse.redirect(signInUrl);
	}

	return NextResponse.next();
}

export const config = { matcher: [AppRoutes.DASHBOARD] };
