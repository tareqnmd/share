import type { Metadata } from 'next';
import { siteConfig } from './config';

export const dashboardMetadata: Metadata = {
	title: 'Dashboard',
	description:
		'Manage your code files, create new snippets, and control sharing permissions from your personal dashboard.',
	keywords: [...siteConfig.keywords, 'code dashboard', 'file management', 'my files', 'snippets'],
	openGraph: {
		title: `Dashboard | ${siteConfig.name}`,
		description:
			'Manage your code files, create new snippets, and control sharing permissions from your personal dashboard.',
		url: `${siteConfig.url}/dashboard`,
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				alt: 'Share Dashboard',
			},
		],
	},
	twitter: {
		title: `Dashboard | ${siteConfig.name}`,
		description:
			'Manage your code files, create new snippets, and control sharing permissions from your personal dashboard.',
		images: [siteConfig.ogImage],
	},
	alternates: {
		canonical: `${siteConfig.url}/dashboard`,
	},
	robots: {
		index: false,
		follow: false,
	},
};
