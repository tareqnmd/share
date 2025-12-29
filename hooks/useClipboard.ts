'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const COPY_TIMEOUT_MS = 2000;

export function useClipboard() {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), COPY_TIMEOUT_MS);
			toast.success('Copied to clipboard');
			return true;
		} catch {
			const textarea = document.createElement('textarea');
			textarea.value = text;
			textarea.style.position = 'fixed';
			textarea.style.opacity = '0';
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			setCopied(true);
			setTimeout(() => setCopied(false), COPY_TIMEOUT_MS);
			toast.success('Copied to clipboard');
			return true;
		}
	}, []);

	return { copied, copyToClipboard };
}
