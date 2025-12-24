import { SaveStatus } from '@/types/enums';
import { SaveStatusIndicatorProps } from '@/types/types';

export default function SaveStatusIndicator({
	status,
	isSaving,
	canEdit,
	error,
}: SaveStatusIndicatorProps) {
	if (!canEdit) return null;

	return (
		<div className="flex items-center gap-2 text-xs">
			{error && (
				<>
					<div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
					<span className="text-red-400 max-w-[200px] truncate" title={error}>
						{error}
					</span>
				</>
			)}
			{!error && (status === SaveStatus.SAVING || isSaving) && (
				<>
					<div className="w-2 h-2 rounded-full bg-warning-500 animate-pulse" />
					<span className="text-warning-400">Saving...</span>
				</>
			)}
			{!error && status === SaveStatus.SAVED && !isSaving && (
				<>
					<div className="w-2 h-2 rounded-full bg-success-500" />
					<span className="text-success-400">Saved</span>
				</>
			)}
			{!error && status === SaveStatus.UNSAVED && !isSaving && (
				<>
					<div className="w-2 h-2 rounded-full bg-neutral-500" />
					<span className="text-neutral-400">Unsaved</span>
				</>
			)}
		</div>
	);
}
