import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Share',
		short_name: 'Share',
		description: 'Share code securely',
		start_url: '/',
		display: 'standalone',
		background_color: '#0a0a0a',
		theme_color: '#0a0a0a',
		icons: [
			{
				src: '/assets/meta/favicon-16x16.png',
				sizes: '16x16',
				type: 'image/png',
			},
			{
				src: '/assets/meta/favicon-32x32.png',
				sizes: '32x32',
				type: 'image/png',
			},
			{
				src: '/assets/meta/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/assets/meta/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
			{
				src: '/assets/meta/apple-touch-icon.png',
				sizes: '180x180',
				type: 'image/png',
			},
		],
	};
}
