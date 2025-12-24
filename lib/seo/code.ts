import type { Metadata } from 'next';
import { siteConfig } from './config';

export interface CodeFileMetaData {
	id: string;
	title: string;
	language: string;
	visibility: string;
	createdBy?: {
		name?: string;
	};
}

export function generateCodeMetadata(file: CodeFileMetaData | null): Metadata {
	if (!file) {
		return {
			title: 'Code File Not Found',
			description: 'The requested code file could not be found.',
			robots: {
				index: false,
				follow: false,
			},
		};
	}

	const title = file.title || 'Untitled';
	const languageDisplay = file.language.charAt(0).toUpperCase() + file.language.slice(1);
	const authorName = file.createdBy?.name || 'Anonymous';
	const description = `${languageDisplay} code snippet "${title}" shared by ${authorName} on ${siteConfig.name}. View, copy, or collaborate on this code file.`;

	const isPublic = file.visibility === 'public';

	return {
		title: title,
		description: description,
		keywords: [
			...siteConfig.keywords,
			file.language,
			languageDisplay,
			'code snippet',
			'shared code',
			title.toLowerCase(),
		],
		openGraph: {
			title: `${title} | ${siteConfig.name}`,
			description: description,
			url: `${siteConfig.url}/code/${file.id}`,
			type: 'article',
			images: [
				{
					url: siteConfig.ogImage,
					width: 1200,
					height: 630,
					alt: `${title} - ${languageDisplay} Code Snippet`,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: `${title} | ${siteConfig.name}`,
			description: description,
			images: [siteConfig.ogImage],
		},
		alternates: {
			canonical: `${siteConfig.url}/code/${file.id}`,
		},
		robots: {
			index: isPublic,
			follow: isPublic,
		},
		other: {
			'article:author': authorName,
		},
	};
}

export const codeNotFoundMetadata: Metadata = {
	title: 'Code File Not Found',
	description:
		'The requested code file could not be found or you do not have permission to view it.',
	robots: {
		index: false,
		follow: false,
	},
};
