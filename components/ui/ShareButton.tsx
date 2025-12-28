'use client';

import { CheckCircleIcon, ShareIcon } from '@/components/icons';
import { useShare } from '@/hooks';
import { ShareButtonProps } from '@/interfaces/share-button.types';

export default function ShareButton({ className = '' }: ShareButtonProps) {
	const { shared, share } = useShare();

	return (
		<button
			onClick={share}
			className={`
				flex items-center gap-1.5
				px-3 py-1.5
				text-xs font-medium
				rounded-md
				transition-all duration-200
				cursor-pointer
				${
					shared
						? 'bg-success-600 text-white'
						: 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-50'
				}
				border border-neutral-700
				shadow-sm
				${className}
			`}
			title={shared ? 'Link copied!' : 'Share link'}
		>
			{shared ? (
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
