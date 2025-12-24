import { SaveStatus } from '@/types/enums';
import { SaveStatusIndicatorProps } from '@/types/types';

export default function SaveStatusIndicator({
	status,
	isSaving,
	canEdit,
	error,
}: SaveStatusIndicatorProps) {
	if (!canEdit) return null;

	const getStatusConfig = () => {
		if (error) {
			return {
				bgColor: 'bg-danger-500/15',
				dotColor: 'bg-danger-500',
				textColor: 'text-danger-400',
				ringColor: 'ring-danger-500/30',
				label: error,
				animate: true,
				icon: (
					<svg
						className="w-3.5 h-3.5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
						/>
					</svg>
				),
			};
		}

		if (status === SaveStatus.SAVING || isSaving) {
			return {
				bgColor: 'bg-warning-400/15',
				dotColor: 'bg-warning-400',
				textColor: 'text-warning-400',
				ringColor: 'ring-warning-400/30',
				label: 'Saving...',
				animate: true,
				icon: (
					<svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="3"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
				),
			};
		}

		if (status === SaveStatus.SAVED) {
			return {
				bgColor: 'bg-success-500/15',
				dotColor: 'bg-success-500',
				textColor: 'text-success-400',
				ringColor: 'ring-success-500/30',
				label: 'Saved',
				animate: false,
				icon: (
					<svg
						className="w-3.5 h-3.5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
					</svg>
				),
			};
		}

		// UNSAVED
		return {
			bgColor: 'bg-neutral-800',
			dotColor: 'bg-neutral-500',
			textColor: 'text-neutral-400',
			ringColor: 'ring-neutral-700',
			label: 'Unsaved',
			animate: false,
			icon: (
				<svg
					className="w-3.5 h-3.5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
					/>
				</svg>
			),
		};
	};

	const config = getStatusConfig();

	return (
		<div
			className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
				ring-1 transition-all duration-300 ${config.bgColor} ${config.textColor} ${config.ringColor}`}
			title={error || undefined}
		>
			<span className={config.animate ? 'animate-pulse' : ''}>{config.icon}</span>
			<span className="max-w-[100px] sm:max-w-[150px] truncate">{config.label}</span>
		</div>
	);
}
