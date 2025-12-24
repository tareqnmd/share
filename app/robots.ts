import { siteConfig } from '@/lib/seo';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/api/', '/code/'],
		},
		sitemap: `${siteConfig.url}/sitemap.xml`,
	};
}
