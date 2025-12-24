'use client';

import {
	deleteCodeFile,
	updateCodeFile,
	updateCodeFileSettings,
} from '@/app/actions';
import CopyButton from '@/components/ui/CopyButton';
import DropdownMenu from '@/components/ui/DropdownMenu';
import Select from '@/components/ui/Select';
import { EDIT_MODE_OPTIONS, LANGUAGE_OPTIONS } from '@/lib/constants';
import { AppRoutes, FileEditMode, FileVisibility } from '@/types/enums';
import { CodeFileInput } from '@/utils/validations';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import CodeEditor from './CodeEditor';

interface FileProps {
	_id: string;
	title: string;
	content: string;
	language: string;
	visibility: FileVisibility;
	editMode: FileEditMode;
	createdBy: {
		_id: string;
		name: string;
	};
	createdAt: string;
	updatedAt: string;
}

interface FileEditorProps {
	file: FileProps;
	canEdit: boolean;
	currentUserId?: string;
}

export default function FileEditor({
	file,
	canEdit,
	currentUserId,
}: FileEditorProps) {
	const [content, setContent] = useState(file.content);
	const [title, setTitle] = useState(file.title);
	const [language, setLanguage] = useState(file.language);
	const [visibility, setVisibility] = useState(file.visibility);
	const [editMode, setEditMode] = useState(file.editMode);
	const [isSaving, startTransition] = useTransition();
	const [isDeleting, startDeleteTransition] = useTransition();
	const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>(
		'saved'
	);
	const router = useRouter();
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastSavedContentRef = useRef(file.content);

	const isOwner = file.createdBy._id === currentUserId;

	// Auto-save function
	const saveContent = useCallback(
		(newContent: string) => {
			if (newContent === lastSavedContentRef.current) return;

			setSaveStatus('saving');
			startTransition(async () => {
				try {
					await updateCodeFile(file._id, newContent);
					lastSavedContentRef.current = newContent;
					setSaveStatus('saved');
				} catch {
					setSaveStatus('unsaved');
				}
			});
		},
		[file._id]
	);

	// Debounced auto-save on content change
	useEffect(() => {
		if (!canEdit) return;
		if (content === lastSavedContentRef.current) return;

		setSaveStatus('unsaved');

		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
		}

		saveTimeoutRef.current = setTimeout(() => {
			saveContent(content);
		}, 1000); // Auto-save after 1 second of no typing

		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, [content, canEdit, saveContent]);

	// Save on unmount if there are unsaved changes
	useEffect(() => {
		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, []);

	const handleSettingsUpdate = (updates: Partial<CodeFileInput>) => {
		startTransition(async () => {
			try {
				await updateCodeFileSettings(file._id, updates);
				if (updates.title) setTitle(updates.title);
				if (updates.language) setLanguage(updates.language);
				if (updates.visibility) setVisibility(updates.visibility);
				if (updates.editMode) setEditMode(updates.editMode);
			} catch {
				alert('Failed to update settings');
			}
		});
	};

	const handleDelete = () => {
		if (!confirm('Are you sure you want to delete this file?')) return;
		startDeleteTransition(async () => {
			try {
				await deleteCodeFile(file._id);
				router.push(AppRoutes.DASHBOARD);
			} catch {
				alert('Failed to delete');
			}
		});
	};

	const toggleVisibility = () => {
		const newVisibility =
			visibility === FileVisibility.PUBLIC
				? FileVisibility.PRIVATE
				: FileVisibility.PUBLIC;
		handleSettingsUpdate({ visibility: newVisibility });
	};

	const menuItems = [
		{
			label:
				visibility === FileVisibility.PUBLIC ? 'Make Private' : 'Make Public',
			onClick: toggleVisibility,
			icon:
				visibility === FileVisibility.PUBLIC ? (
					<svg
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
						/>
					</svg>
				) : (
					<svg
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				),
		},
		...EDIT_MODE_OPTIONS.map((option) => ({
			label: option.label,
			onClick: () =>
				handleSettingsUpdate({ editMode: option.value as FileEditMode }),
			icon:
				editMode === option.value ? (
					<svg
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
					</svg>
				) : null,
		})),
		...(isOwner
			? [
					{
						label: isDeleting ? 'Deleting...' : 'Delete File',
						onClick: handleDelete,
						variant: 'danger' as const,
						disabled: isDeleting,
						icon: (
							<svg
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						),
					},
			  ]
			: []),
	];

	const SaveStatusIndicator = () => {
		if (!canEdit) return null;

		return (
			<div className="flex items-center gap-2 text-xs">
				{saveStatus === 'saving' && (
					<>
						<div className="w-2 h-2 rounded-full bg-warning-500 animate-pulse" />
						<span className="text-warning-400">Saving...</span>
					</>
				)}
				{saveStatus === 'saved' && (
					<>
						<div className="w-2 h-2 rounded-full bg-success-500" />
						<span className="text-success-400">Saved</span>
					</>
				)}
				{saveStatus === 'unsaved' && !isSaving && (
					<>
						<div className="w-2 h-2 rounded-full bg-neutral-500" />
						<span className="text-neutral-400">Unsaved</span>
					</>
				)}
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-800 pb-4">
				<div className="flex flex-col gap-1 flex-1 w-full">
					<div className="flex items-center gap-3">
						{canEdit ? (
							<input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								onBlur={() => handleSettingsUpdate({ title })}
								className="text-2xl font-bold bg-transparent border-none focus:ring-0 w-full p-0 text-neutral-50 focus:outline-none"
								placeholder="File Title"
							/>
						) : (
							<h1 className="text-2xl font-bold text-neutral-50">{title}</h1>
						)}
					</div>

					<div className="flex items-center gap-4 text-sm text-neutral-400">
						<span>
							Created by {file.createdBy.name} •{' '}
							{new Date(file.createdAt).toLocaleDateString()}
						</span>
						<SaveStatusIndicator />
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

				<div className="flex flex-wrap gap-2 items-center">
					{canEdit && (
						<>
							<Select
								options={LANGUAGE_OPTIONS}
								value={language}
								onChange={(e) =>
									handleSettingsUpdate({ language: e.target.value })
								}
							/>

							<DropdownMenu items={menuItems} />
						</>
					)}
					{!canEdit && (
						<div className="text-sm text-neutral-500 italic">Read Only</div>
					)}
				</div>
			</div>

			<div className="relative">
				<div className="absolute top-3 right-3 z-10">
					<CopyButton text={content} />
				</div>
				<CodeEditor
					code={content}
					language={language}
					readOnly={!canEdit}
					onChange={(val) => setContent(val || '')}
				/>
			</div>
		</div>
	);
}
