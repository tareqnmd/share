'use client';

import { useState } from 'react';

interface CopyButtonProps {
	text: string;
	className?: string;
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Fallback for older browsers
			const textarea = document.createElement('textarea');
			textarea.value = text;
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
			onClick={handleCopy}
			className={`
				flex items-center gap-1.5
				px-3 py-1.5
				text-xs font-medium
				rounded-md
				transition-all duration-200
				${copied 
					? 'bg-success-600 text-white' 
					: 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-50'
				}
				border border-neutral-700
				shadow-sm
				${className}
			`}
			title={copied ? 'Copied!' : 'Copy to clipboard'}
		>
			{copied ? (
				<>
					<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
					<span>Copied!</span>
				</>
			) : (
				<>
					<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
					</svg>
					<span>Copy</span>
				</>
			)}
		</button>
	);
}

