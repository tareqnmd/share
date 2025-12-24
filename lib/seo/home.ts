import type { Metadata } from 'next';
import { siteConfig } from './config';

export const homeMetadata: Metadata = {
	title: 'Share Your Code Securely',
	description:
		'A platform for developers to share code snippets, collaborate in real-time, and manage their code files with granular permissions. Support for JavaScript, TypeScript, Python, and more.',
	keywords: [
		...siteConfig.keywords,
		'share code online',
		'code paste',
		'secure code sharing',
		'snippet manager',
	],
	openGraph: {
		title: `${siteConfig.name} - Share Your Code Securely`,
		description:
			'A platform for developers to share code snippets, collaborate in real-time, and manage their code files with granular permissions.',
		url: siteConfig.url,
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				alt: 'Share - Share Your Code Securely',
			},
		],
	},
	twitter: {
		title: `${siteConfig.name} - Share Your Code Securely`,
		description:
			'A platform for developers to share code snippets, collaborate in real-time, and manage their code files with granular permissions.',
		images: [siteConfig.ogImage],
	},
	alternates: {
		canonical: siteConfig.url,
	},
};
