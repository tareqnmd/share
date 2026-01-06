import { siteConfig } from './config';

export { codeNotFoundMetadata, generateCodeMetadata } from './code';
export type { CodeFileMetaData } from './code';
export { baseMetadata, siteConfig } from './config';
export { dashboardMetadata } from './dashboard';
export { homeMetadata } from './home';

export function generateOrganizationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: siteConfig.name,
		description: siteConfig.description,
		url: siteConfig.url,
		logo: `${siteConfig.url}/images/shared/logo.png`,
		sameAs: [],
		contactPoint: {
			'@type': 'ContactPoint',
			contactType: 'customer service',
			email: `tareqnmd@gmail.com`,
		},
	};
}

export function generateWebsiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: siteConfig.name,
		description: siteConfig.description,
		url: siteConfig.url,
		potentialAction: {
			'@type': 'SearchAction',
			target: `${siteConfig.url}/blogs?title={search_term_string}`,
			'query-input': 'required name=search_term_string',
		},
	};
}
