'use client';

import { analytics } from '@/lib/seo/config';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { Suspense, useEffect } from 'react';
import { pageview } from '../analytics.helpers';

const GA4_ID = analytics.ga4Id;
const IS_ENABLED = !!GA4_ID;

function AnalyticsTracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (pathname) {
			const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
			pageview(url);
		}
	}, [pathname, searchParams]);

	return null;
}

export default function Analytics() {
	if (!IS_ENABLED || !GA4_ID) {
		return null;
	}

	return (
		<>
			<Script
				id="ga4-init"
				strategy="lazyOnload"
				dangerouslySetInnerHTML={{
					__html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', {
                  analytics_storage: 'granted',
                  ad_storage: 'granted',
                  wait_for_update: 500
                });
              `,
				}}
			/>
			<Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="lazyOnload" />
			<Script
				id="ga4-config"
				strategy="lazyOnload"
				dangerouslySetInnerHTML={{
					__html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_ID}', {
                  page_path: window.location.pathname,
                  send_page_view: false
                });
              `,
				}}
			/>

			<Suspense fallback={null}>
				<AnalyticsTracker />
			</Suspense>
		</>
	);
}
