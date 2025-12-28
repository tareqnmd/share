'use client';

import { CheckCircleIcon, CopyIcon } from '@/components/icons';
import { useClipboard } from '@/hooks';
import { CopyButtonProps } from '@/interfaces/copy-button.types';

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
	const { copied, copyToClipboard } = useClipboard();

	return (
		<button
			onClick={() => copyToClipboard(text)}
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
