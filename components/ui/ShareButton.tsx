'use client';

import { CheckCircleIcon, ShareIcon } from '@/components/icons';
import { useState } from 'react';

interface ShareButtonProps {
	className?: string;
}

export default function ShareButton({ className = '' }: ShareButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleShare = async () => {
		const url = window.location.href;

		if (navigator.share) {
			try {
				await navigator.share({
					title: document.title,
					url: url,
				});
				return;
			} catch (err) {
				if ((err as Error).name === 'AbortError') return;
			}
		}

		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			const textarea = document.createElement('textarea');
			textarea.value = url;
			textarea.style.position = 'fixed';
			textarea.style.opacity = '0';
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<button
			onClick={handleShare}
			className={`
				flex items-center gap-1.5
				px-3 py-1.5
				text-xs font-medium
				rounded-md
				transition-all duration-200
				cursor-pointer
				${
					copied
						? 'bg-success-600 text-white'
						: 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-50'
				}
				border border-neutral-700
				shadow-sm
				${className}
			`}
			title={copied ? 'Link copied!' : 'Share link'}
		>
			{copied ? (
				<>
					<CheckCircleIcon className="w-3.5 h-3.5" />
					<span>Copied!</span>
				</>
			) : (
				<>
					<ShareIcon className="w-3.5 h-3.5" />
					<span>Share</span>
				</>
			)}
		</button>
	);
}
