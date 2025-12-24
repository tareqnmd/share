'use client';

import { FileVisibility, SaveStatus } from '@/types/enums';
import SaveStatusIndicator from './SaveStatusIndicator';

interface FileHeaderProps {
	title: string;
	canEdit: boolean;
	onTitleChange: (value: string) => void;
	onTitleBlur: () => void;
}

export default function FileHeader({
	title,
	canEdit,
	onTitleChange,
	onTitleBlur,
}: FileHeaderProps) {
	return (
		<div className="flex flex-col gap-3 w-full min-w-0">
			{canEdit ? (
				<input
					value={title}
					onChange={(e) => onTitleChange(e.target.value)}
					onBlur={onTitleBlur}
					onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
					className="text-xl sm:text-2xl font-bold bg-transparent border-transparent 
						hover:border-neutral-700 focus:border-primary-500 
						py-1 w-full text-neutral-50 
						focus:outline-none transition-colors duration-200 placeholder:text-neutral-600"
					placeholder="Untitled file..."
				/>
			) : (
				<h1 className="text-xl sm:text-2xl font-bold text-neutral-50 truncate py-1">{title}</h1>
			)}
		</div>
	);
}

interface FileMetaInfoProps {
	visibility: FileVisibility;
	createdByName: string;
	createdAt: string;
	canEdit: boolean;
	saveStatus: SaveStatus;
	isSaving: boolean;
	saveError: string | null;
}

// Separate component for meta info to be used at the bottom
export function FileMetaInfo({
	visibility,
	createdByName,
	createdAt,
	canEdit,
	saveStatus,
	isSaving,
	saveError,
}: FileMetaInfoProps) {
	const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});

	return (
		<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
			{/* Author & Date */}
			<div className="flex items-center gap-2 text-neutral-400">
				<div className="flex items-center gap-1.5">
					<svg
						className="w-4 h-4 text-neutral-500 shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.5}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
						/>
					</svg>
					<span className="truncate max-w-[120px] sm:max-w-none">{createdByName}</span>
				</div>
				<span className="text-neutral-600">•</span>
				<div className="flex items-center gap-1.5">
					<svg
						className="w-4 h-4 text-neutral-500 shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.5}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
						/>
					</svg>
					<span>{formattedDate}</span>
				</div>
			</div>

			{/* Divider */}
			<div className="w-px h-4 bg-neutral-700 hidden sm:block" />

			{/* Visibility Badge */}
			<div
				className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
					transition-colors duration-200 ${
						visibility === FileVisibility.PUBLIC
							? 'bg-success-500/15 text-success-400 ring-1 ring-success-500/30'
							: 'bg-neutral-800 text-neutral-400 ring-1 ring-neutral-700'
					}`}
			>
				{visibility === FileVisibility.PUBLIC ? (
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
							d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
						/>
					</svg>
				) : (
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
							d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
						/>
					</svg>
				)}
				<span>{visibility === FileVisibility.PUBLIC ? 'Public' : 'Private'}</span>
			</div>

			{/* Save Status */}
			<SaveStatusIndicator
				status={saveStatus}
				isSaving={isSaving}
				canEdit={canEdit}
				error={saveError}
			/>
		</div>
	);
}
