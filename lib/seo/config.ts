import type { Metadata } from 'next';

export const siteConfig = {
	name: 'Share',
	shortName: 'Share',
	description:
		'A secure platform for developers to share code snippets, collaborate in real-time, and manage files with granular permissions.',
	url: process.env.NEXT_PUBLIC_APP_URL || 'https://share.tareqnmd.com',
	ogImage: '/assets/meta/og-image.png',
	author: 'Md Tareq',
	authorUrl: 'https://tareqnmd.com',
	authorImage: '/assets/meta/author.webp',
	authorUsername: 'tareqnmd',
	creator: '@tareqnmd',
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

const ogImageUrl = new URL(siteConfig.ogImage, siteConfig.url).toString();
const authorImageUrl = new URL(siteConfig.authorImage, siteConfig.url).toString();

export const baseMetadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: siteConfig.keywords,
	authors: [{ name: siteConfig.author, url: siteConfig.authorUrl }],
	creator: siteConfig.creator,
	publisher: siteConfig.author,
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	manifest: '/manifest.webmanifest',
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: siteConfig.url,
		siteName: siteConfig.name,
		title: siteConfig.name,
		description: siteConfig.description,
		images: [
			{
				url: ogImageUrl,
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
		images: [ogImageUrl],
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
	verification: {
		google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE,
	},
	other: {
		'author:image': authorImageUrl,
		'author:url': siteConfig.authorUrl,
		'author:name': siteConfig.author,
		'author:username': siteConfig.authorUsername,
	},
};

export const analyticsConfig = {
	ga4Id: process.env.NEXT_PUBLIC_GA4_ID,
	googleVerification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE,
};
