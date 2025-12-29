'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const SHARE_TIMEOUT_MS = 2000;

export function useShare() {
	const [shared, setShared] = useState(false);

	const share = useCallback(async (): Promise<boolean> => {
		const url = window.location.href;

		if (navigator.share) {
			try {
				await navigator.share({
					title: document.title,
					url: url,
				});
				toast.success('Shared successfully');
				return true;
			} catch (err) {
				if ((err as Error).name === 'AbortError') return false;
			}
		}

		try {
			await navigator.clipboard.writeText(url);
			setShared(true);
			setTimeout(() => setShared(false), SHARE_TIMEOUT_MS);
			toast.success('Link copied to clipboard');
			return true;
		} catch {
			const textarea = document.createElement('textarea');
			textarea.value = url;
			textarea.style.position = 'fixed';
			textarea.style.opacity = '0';
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			setShared(true);
			setTimeout(() => setShared(false), SHARE_TIMEOUT_MS);
			toast.success('Link copied to clipboard');
			return true;
		}
	}, []);

	return { shared, share };
}
