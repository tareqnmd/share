import type { NextConfig } from 'next';

// Security headers configuration
const securityHeaders = [
	{
		key: 'X-DNS-Prefetch-Control',
		value: 'on',
	},
	{
		key: 'Strict-Transport-Security',
		value: 'max-age=63072000; includeSubDomains; preload',
	},
	{
		key: 'X-Frame-Options',
		value: 'SAMEORIGIN',
	},
	{
		key: 'X-Content-Type-Options',
		value: 'nosniff',
	},
	{
		key: 'Referrer-Policy',
		value: 'origin-when-cross-origin',
	},
	{
		key: 'Permissions-Policy',
		value: 'camera=(), microphone=(), geolocation=()',
	},
];

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*.googleusercontent.com',
				pathname: '/**',
			},
		],
	},
	redirects: async () => {
		return [
			{
				source: '/code',
				destination: '/',
				permanent: true,
			},
		];
	},
	headers: async () => {
		return [
			{
				// Apply security headers to all routes
				source: '/:path*',
				headers: securityHeaders,
			},
		];
	},
};

export default nextConfig;
