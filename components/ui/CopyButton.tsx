'use client';

import { useState } from 'react';
import { CopyIcon, CheckCircleIcon } from '@/components/icons';

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
				${
					copied
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
					<CheckCircleIcon className="w-3.5 h-3.5" />
					<span>Copied!</span>
				</>
			) : (
				<>
					<CopyIcon className="w-3.5 h-3.5" />
					<span>Copy</span>
				</>
			)}
		</button>
	);
}
