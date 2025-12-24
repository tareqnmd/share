'use client';

import { deleteCodeFile, updateCodeFile, updateCodeFileSettings } from '@/app/actions';
import CopyButton from '@/components/ui/CopyButton';
import { MAX_CONTENT_LENGTH, MIN_SAVE_INTERVAL_MS, SAVE_DEBOUNCE_MS } from '@/lib/constants';
import { AppRoutes, SaveStatus } from '@/types/enums';
import { FileEditorProps } from '@/types/types';
import { CodeFileInput } from '@/utils/validations';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import CodeEditor from './CodeEditor';
import FileControls from './FileControls';
import FileHeader, { FileMetaInfo } from './FileHeader';

export default function FileEditor({ file, canEdit, currentUserId }: FileEditorProps) {
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
	const titleSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastSavedContentRef = useRef(file.content);
	const lastSavedTitleRef = useRef(file.title);
	const lastSaveTimeRef = useRef<number>(0);
	const pendingContentRef = useRef<string | null>(null);
	const isMountedRef = useRef(true);
	const hasUserEditedRef = useRef(false);

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
		lastSavedTitleRef.current = file.title;
		pendingContentRef.current = null;
		hasUserEditedRef.current = false;

		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
			saveTimeoutRef.current = null;
		}
		if (titleSaveTimeoutRef.current) {
			clearTimeout(titleSaveTimeoutRef.current);
			titleSaveTimeoutRef.current = null;
		}
	}, [file._id, file.content, file.title]);

	const saveContent = useCallback(
		async (newContent: string, isImmediate = false): Promise<boolean> => {
			if (!isMountedRef.current) return false;
			if (newContent === lastSavedContentRef.current) return true;

			if (newContent.length > MAX_CONTENT_LENGTH) {
				setSaveError(`Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters`);
				setSaveStatus(SaveStatus.UNSAVED);
				return false;
			}

			const now = Date.now();
			if (!isImmediate && now - lastSaveTimeRef.current < MIN_SAVE_INTERVAL_MS) {
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
					const errorMessage = error instanceof Error ? error.message : 'Failed to save';
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
				setSaveError(`Content exceeds maximum length (${newContent.length}/${MAX_CONTENT_LENGTH})`);
				setSaveStatus(SaveStatus.UNSAVED);
				return;
			}

			hasUserEditedRef.current = true;
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
			if (titleSaveTimeoutRef.current) {
				clearTimeout(titleSaveTimeoutRef.current);
				titleSaveTimeoutRef.current = null;
			}

			const pendingContent = pendingContentRef.current;

			if (
				hasUserEditedRef.current &&
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
				if (updates.title) {
					setTitle(updates.title);
					lastSavedTitleRef.current = updates.title;
				}
				if (updates.language) setLanguage(updates.language);
				if (updates.visibility) setVisibility(updates.visibility);
				if (updates.editMode) setEditMode(updates.editMode);
			} catch {
				alert('Failed to update settings');
			}
		});
	};

	const handleTitleChange = (newTitle: string) => {
		setTitle(newTitle);

		if (titleSaveTimeoutRef.current) {
			clearTimeout(titleSaveTimeoutRef.current);
		}

		if (newTitle !== lastSavedTitleRef.current) {
			titleSaveTimeoutRef.current = setTimeout(() => {
				handleSettingsUpdate({ title: newTitle });
			}, SAVE_DEBOUNCE_MS);
		}
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

	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-[1fr_auto] items-center gap-4">
				<FileHeader title={title} canEdit={canEdit} onTitleChange={handleTitleChange} />

				<FileControls
					language={language}
					visibility={visibility}
					editMode={editMode}
					canEdit={canEdit}
					isOwner={isOwner}
					isDeleting={isDeleting}
					onSettingsUpdate={handleSettingsUpdate}
					onDelete={handleDelete}
				/>
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

			<div className="border-t border-neutral-800 pt-4">
				<FileMetaInfo
					visibility={visibility}
					createdByName={file.createdBy.name}
					createdAt={file.createdAt}
					canEdit={canEdit}
					saveStatus={saveStatus}
					isSaving={isSaving}
					saveError={saveError}
				/>
			</div>
		</div>
	);
}
