'use client';

import {
	deleteCodeFile,
	updateCodeFile,
	updateCodeFileSettings,
} from '@/app/actions';
import {
	GlobeIcon,
	LockIcon,
	TrashIcon,
	UserIcon,
	UsersIcon,
} from '@/components/icons';
import CopyButton from '@/components/ui/CopyButton';
import DropdownMenu from '@/components/ui/DropdownMenu';
import Select from '@/components/ui/Select';
import {
	LANGUAGE_OPTIONS,
	MAX_CONTENT_LENGTH,
	MIN_SAVE_INTERVAL_MS,
	SAVE_DEBOUNCE_MS,
} from '@/lib/constants';
import {
	AppRoutes,
	DropdownItemVariant,
	FileEditMode,
	FileVisibility,
	SaveStatus,
} from '@/types/enums';
import {
	CodeFile,
	FileEditorProps,
	SaveStatusIndicatorProps,
} from '@/types/types';
import { CodeFileInput } from '@/utils/validations';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import CodeEditor from './CodeEditor';

function SaveStatusIndicator({
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
					<span
						className="text-red-400 max-w-[200px] truncate"
						title={error}
					>
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
	const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.SAVED);
	const [saveError, setSaveError] = useState<string | null>(null);
	const router = useRouter();

	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastSavedContentRef = useRef(file.content);
	const lastSaveTimeRef = useRef<number>(0);
	const pendingContentRef = useRef<string | null>(null);
	const isMountedRef = useRef(true);

	const [prevFileId, setPrevFileId] = useState(file._id);

	const isOwner = file.createdBy._id === currentUserId;

	if (file._id !== prevFileId) {
		setPrevFileId(file._id);
		setContent(file.content);
		setTitle(file.title);
		setLanguage(file.language);
		setVisibility(file.visibility);
		setEditMode(file.editMode);
		setSaveStatus(SaveStatus.SAVED);
		setSaveError(null);
	}

	useEffect(() => {
		lastSavedContentRef.current = file.content;
		pendingContentRef.current = null;

		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
			saveTimeoutRef.current = null;
		}
	}, [file._id, file.content]);

	const saveContent = useCallback(
		async (newContent: string, isImmediate = false): Promise<boolean> => {
			if (!isMountedRef.current) return false;
			if (newContent === lastSavedContentRef.current) return true;

			if (newContent.length > MAX_CONTENT_LENGTH) {
				setSaveError(
					`Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters`
				);
				setSaveStatus(SaveStatus.UNSAVED);
				return false;
			}

			const now = Date.now();
			if (
				!isImmediate &&
				now - lastSaveTimeRef.current < MIN_SAVE_INTERVAL_MS
			) {
				pendingContentRef.current = newContent;
				return false;
			}

			setSaveStatus(SaveStatus.SAVING);
			setSaveError(null);

			try {
				await updateCodeFile(file._id, newContent);
				if (isMountedRef.current) {
					lastSavedContentRef.current = newContent;
					lastSaveTimeRef.current = Date.now();
					pendingContentRef.current = null;
					setSaveStatus(SaveStatus.SAVED);
				}
				return true;
			} catch (error) {
				if (isMountedRef.current) {
					const errorMessage =
						error instanceof Error ? error.message : 'Failed to save';
					setSaveError(errorMessage);
					setSaveStatus(SaveStatus.UNSAVED);
				}
				return false;
			}
		},
		[file._id]
	);

	const handleContentChange = useCallback(
		(newContent: string) => {
			setContent(newContent);

			if (!canEdit || newContent === lastSavedContentRef.current) {
				if (newContent === lastSavedContentRef.current) {
					setSaveStatus(SaveStatus.SAVED);
					setSaveError(null);
				}
				return;
			}

			if (newContent.length > MAX_CONTENT_LENGTH) {
				setSaveError(
					`Content exceeds maximum length (${newContent.length}/${MAX_CONTENT_LENGTH})`
				);
				setSaveStatus(SaveStatus.UNSAVED);
				return;
			}

			setSaveStatus(SaveStatus.UNSAVED);
			setSaveError(null);
			pendingContentRef.current = newContent;

			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}

			saveTimeoutRef.current = setTimeout(() => {
				startTransition(async () => {
					await saveContent(newContent);
				});
			}, SAVE_DEBOUNCE_MS);
		},
		[canEdit, saveContent]
	);

	useEffect(() => {
		isMountedRef.current = true;

		return () => {
			isMountedRef.current = false;

			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
				saveTimeoutRef.current = null;
			}

			const pendingContent = pendingContentRef.current;
			if (
				pendingContent &&
				pendingContent !== lastSavedContentRef.current &&
				canEdit
			) {
				try {
					const data = JSON.stringify({
						fileId: file._id,
						content: pendingContent,
					});
					navigator.sendBeacon('/api/save-on-unload', data);
				} catch {}
			}
		};
	}, [file._id, canEdit]);

	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			const hasUnsavedChanges =
				pendingContentRef.current !== null &&
				pendingContentRef.current !== lastSavedContentRef.current;

			if (hasUnsavedChanges && canEdit) {
				e.preventDefault();
				return 'You have unsaved changes. Are you sure you want to leave?';
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [canEdit]);

	useEffect(() => {
		const interval = setInterval(() => {
			const pending = pendingContentRef.current;
			if (pending && pending !== lastSavedContentRef.current && canEdit) {
				const timeSinceLastSave = Date.now() - lastSaveTimeRef.current;
				if (timeSinceLastSave >= MIN_SAVE_INTERVAL_MS) {
					startTransition(async () => {
						await saveContent(pending);
					});
				}
			}
		}, MIN_SAVE_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [canEdit, saveContent]);

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

	const menuSections = [
		{
			title: 'Visibility',
			items: [
				{
					label: 'Public',
					onClick: () =>
						handleSettingsUpdate({ visibility: FileVisibility.PUBLIC }),
					active: visibility === FileVisibility.PUBLIC,
					icon: <GlobeIcon />,
				},
				{
					label: 'Private',
					onClick: () =>
						handleSettingsUpdate({ visibility: FileVisibility.PRIVATE }),
					active: visibility === FileVisibility.PRIVATE,
					icon: <LockIcon />,
				},
			],
		},
		{
			title: 'Edit Access',
			items: [
				{
					label: 'Owner Only',
					onClick: () => handleSettingsUpdate({ editMode: FileEditMode.OWNER }),
					active: editMode === FileEditMode.OWNER,
					icon: <UserIcon />,
				},
				{
					label: 'Collaborative',
					onClick: () =>
						handleSettingsUpdate({ editMode: FileEditMode.COLLABORATIVE }),
					active: editMode === FileEditMode.COLLABORATIVE,
					icon: <UsersIcon />,
				},
			],
		},
		...(isOwner
			? [
					{
						title: 'Danger Zone',
						items: [
							{
								label: isDeleting ? 'Deleting...' : 'Delete File',
								onClick: handleDelete,
								variant: DropdownItemVariant.DANGER,
								disabled: isDeleting,
								icon: <TrashIcon />,
							},
						],
					},
			  ]
			: []),
	];

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

							<DropdownMenu sections={menuSections} />
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
					onChange={(val) => handleContentChange(val || '')}
				/>
			</div>
		</div>
	);
}
