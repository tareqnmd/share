import { StorageQuotaProps } from '@/interfaces/storage-quota.types';
import { MAX_FILES_PER_USER } from '@/lib/constants';

export default function StorageQuota({ fileCount }: StorageQuotaProps) {
	const percentage = Math.min((fileCount / MAX_FILES_PER_USER) * 100, 100);
	const isMedium = percentage >= 50 && percentage < 80;
	const isHigh = percentage >= 80;

	return (
		<div className="relative overflow-hidden bg-linear-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-5 rounded-xl border border-neutral-700/50 shadow-lg">
			<div
				className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 ${
					isHigh ? 'bg-danger-500' : isMedium ? 'bg-warning-400' : 'bg-success-500'
				}`}
			/>

			<div className="relative flex items-center justify-between gap-4 mb-4">
				<div className="flex items-center gap-3">
					<div
						className={`flex items-center justify-center w-10 h-10 rounded-lg ${
							isHigh
								? 'bg-danger-500/20 text-danger-400'
								: isMedium
									? 'bg-warning-400/20 text-warning-400'
									: 'bg-success-500/20 text-success-400'
						}`}
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					<div>
						<p className="text-sm text-neutral-400 font-medium">Storage Quota</p>
						<p className="text-lg font-semibold text-neutral-50 tracking-tight">
							{fileCount} of {MAX_FILES_PER_USER} files
						</p>
					</div>
				</div>
				<div
					className={`text-2xl font-bold font-mono tabular-nums ${
						isHigh ? 'text-danger-400' : isMedium ? 'text-warning-400' : 'text-success-400'
					}`}
				>
					{Math.round(percentage)}%
				</div>
			</div>

			<div className="relative h-2.5 bg-neutral-700/50 rounded-full overflow-hidden backdrop-blur-sm">
				<div
					className={`h-full rounded-full transition-all duration-500 ease-out ${
						isHigh
							? 'bg-linear-to-r from-danger-600 to-danger-400'
							: isMedium
								? 'bg-linear-to-r from-warning-600 to-warning-400'
								: 'bg-linear-to-r from-success-600 to-success-400'
					}`}
					style={{ width: `${percentage}%` }}
				/>
				<div
					className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"
					style={{ width: `${percentage}%` }}
				/>
			</div>

			{isHigh && (
				<p className="mt-3 text-xs text-danger-400 flex items-center gap-1.5">
					<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
							clipRule="evenodd"
						/>
					</svg>
					Approaching storage limit
				</p>
			)}
		</div>
	);
}
