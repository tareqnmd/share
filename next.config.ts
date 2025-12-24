import type { NextConfig } from 'next';

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
};

export default nextConfig;
