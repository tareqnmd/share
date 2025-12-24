'use client';

import { FileVisibility, SaveStatus } from '@/types/enums';
import SaveStatusIndicator from './SaveStatusIndicator';

interface FileHeaderProps {
	title: string;
	visibility: FileVisibility;
	createdByName: string;
	createdAt: string;
	canEdit: boolean;
	saveStatus: SaveStatus;
	isSaving: boolean;
	saveError: string | null;
	onTitleChange: (value: string) => void;
	onTitleBlur: () => void;
}

export default function FileHeader({
	title,
	visibility,
	createdByName,
	createdAt,
	canEdit,
	saveStatus,
	isSaving,
	saveError,
	onTitleChange,
	onTitleBlur,
}: FileHeaderProps) {
	return (
		<div className="flex flex-col gap-1 flex-1 w-full">
			<div className="flex items-center gap-3">
				{canEdit ? (
					<input
						value={title}
						onChange={(e) => onTitleChange(e.target.value)}
						onBlur={onTitleBlur}
						className="text-2xl font-bold bg-transparent border-none focus:ring-0 w-full p-0 text-neutral-50 focus:outline-none"
						placeholder="File Title"
					/>
				) : (
					<h1 className="text-2xl font-bold text-neutral-50">{title}</h1>
				)}
			</div>

			<div className="flex items-center gap-4 text-sm text-neutral-400">
				<span>
					Created by {createdByName} • {new Date(createdAt).toLocaleDateString()}
				</span>
				<SaveStatusIndicator
					status={saveStatus}
					isSaving={isSaving}
					canEdit={canEdit}
					error={saveError}
				/>
				<span
					className={`text-xs px-2 py-0.5 rounded-full ${
						visibility === FileVisibility.PUBLIC
							? 'bg-success-500/20 text-success-400'
							: 'bg-neutral-700 text-neutral-400'
					}`}
				>
					{visibility === FileVisibility.PUBLIC ? 'Public' : 'Private'}
				</span>
			</div>
		</div>
	);
}
