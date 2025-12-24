import type { Metadata } from 'next';

export const siteConfig = {
	name: 'Share',
	shortName: 'Share',
	description:
		'A secure platform for developers to share code snippets, collaborate in real-time, and manage files with granular permissions.',
	url: process.env.NEXT_PUBLIC_APP_URL || 'https://share.tareqnmd.com',
	ogImage: '/assets/meta/og-image.png',
	creator: '@share',
	keywords: [
		'code sharing',
		'code snippets',
		'developer tools',
		'collaboration',
		'real-time editing',
		'code editor',
		'syntax highlighting',
		'programming',
		'JavaScript',
		'TypeScript',
		'Python',
	] as string[],
};

export const baseMetadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: siteConfig.keywords,
	authors: [{ name: siteConfig.name }],
	creator: siteConfig.creator,
	publisher: siteConfig.name,
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	manifest: '/manifest.webmanifest',
	icons: {
		icon: [
			{ url: '/assets/meta/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/assets/meta/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
		],
		apple: '/assets/meta/apple-touch-icon.png',
		shortcut: '/assets/meta/favicon.ico',
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: siteConfig.url,
		siteName: siteConfig.name,
		title: siteConfig.name,
		description: siteConfig.description,
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				alt: `${siteConfig.name} - Share Code Securely`,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.name,
		description: siteConfig.description,
		images: [siteConfig.ogImage],
		creator: siteConfig.creator,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	verification: {},
};
