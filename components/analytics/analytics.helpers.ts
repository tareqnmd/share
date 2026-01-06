import { ANALYTICS_CONFIG } from '@/constant';

type GtagCommand = 'event' | 'config' | 'set' | 'js' | 'consent';
type GtagConfig = Record<string, string | number | boolean | Date | undefined>;

declare global {
	interface Window {
		gtag?: (command: GtagCommand, targetId: string | Date, config?: GtagConfig) => void;
		dataLayer?: Array<unknown>;
	}
}

interface AnalyticsEvent {
	action: string;
	category: string;
	label?: string;
	value?: number;
	[key: string]: string | number | boolean | undefined;
}

const GA4_ID = ANALYTICS_CONFIG.ga4Id;
const IS_ENABLED = !!GA4_ID;

function trackEvent({ action, category, label, value, ...additionalParams }: AnalyticsEvent) {
	if (!IS_ENABLED || typeof window === 'undefined' || !window.gtag) return;

	window.gtag('event', action, {
		event_category: category,
		event_label: label,
		value: value,
		...additionalParams,
	});
}

export function pageview(url: string) {
	if (!IS_ENABLED || typeof window === 'undefined' || !window.gtag) return;

	window.gtag('config', GA4_ID, {
		page_path: url,
		page_title: document.title,
		page_location: window.location.href,
	});
}

export const analytics = {
	event: (action: string, params?: Record<string, string | number | boolean | undefined>) => {
		trackEvent({
			action,
			category: (params?.category as string) || 'engagement',
			label: params?.label as string,
			value: params?.value as number,
			...params,
		});
	},
};

export function setUser(userId: string, properties?: Record<string, string | number | boolean>) {
	if (!IS_ENABLED || typeof window === 'undefined' || !window.gtag) return;

	window.gtag('config', GA4_ID, {
		user_id: userId,
	});
	if (properties) {
		window.gtag('set', 'user_properties', properties as GtagConfig);
	}
}

export function grantConsent() {
	if (typeof window === 'undefined') return;

	if (window.gtag) {
		window.gtag('consent', 'update', {
			analytics_storage: 'granted',
			ad_storage: 'granted',
		} as GtagConfig);
	}
}

export function denyConsent() {
	if (typeof window === 'undefined') return;

	if (window.gtag) {
		window.gtag('consent', 'update', {
			analytics_storage: 'denied',
			ad_storage: 'denied',
		} as GtagConfig);
	}
}
