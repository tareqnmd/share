import { siteConfig } from '@/lib/seo';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: siteConfig.url,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: `${siteConfig.url}/dashboard`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.8,
		},
	];
}
