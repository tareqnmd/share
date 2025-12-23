import { withAuth } from 'next-auth/middleware';

export const proxy = withAuth({
	callbacks: {
		authorized: ({ token }) => !!token,
	},
});

export const config = {
	matcher: ['/((?!api|_next|.*\\..*).*)'],
};
