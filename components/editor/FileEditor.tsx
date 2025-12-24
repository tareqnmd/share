'use client';

import { deleteCodeFile, updateCodeFile, updateCodeFileSettings } from '@/app/actions';
import CopyButton from '@/components/ui/CopyButton';
import { MAX_CONTENT_LENGTH, SAVE_DEBOUNCE_MS } from '@/lib/constants';
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
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, startDeleteTransition] = useTransition();
	const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.SAVED);
	const [saveError, setSaveError] = useState<string | null>(null);
	const router = useRouter();

	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastSavedRef = useRef({ content: file.content, title: file.title });
	const pendingRef = useRef({ content: file.content, title: file.title });
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
		lastSavedRef.current = { content: file.content, title: file.title };
		pendingRef.current = { content: file.content, title: file.title };
	}

	const save = useCallback(async () => {
		if (!isMountedRef.current) return;

		const { content: pendingContent, title: pendingTitle } = pendingRef.current;
		const { content: savedContent, title: savedTitle } = lastSavedRef.current;

		const contentChanged = pendingContent !== savedContent;
		const titleChanged = pendingTitle !== savedTitle;

		if (!contentChanged && !titleChanged) {
			setSaveStatus(SaveStatus.SAVED);
			return;
		}

		if (pendingContent.length > MAX_CONTENT_LENGTH) {
			setSaveError(`Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters`);
			setSaveStatus(SaveStatus.UNSAVED);
			return;
		}

		setIsSaving(true);
		setSaveStatus(SaveStatus.SAVING);
		setSaveError(null);

		try {
			await updateCodeFile(file._id, {
				content: pendingContent,
				title: titleChanged ? pendingTitle : undefined,
			});

			if (isMountedRef.current) {
				lastSavedRef.current = { content: pendingContent, title: pendingTitle };
				setSaveStatus(SaveStatus.SAVED);
			}
		} catch (error) {
			if (isMountedRef.current) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to save';
				setSaveError(errorMessage);
				setSaveStatus(SaveStatus.UNSAVED);
			}
		} finally {
			if (isMountedRef.current) {
				setIsSaving(false);
			}
		}
	}, [file._id]);

	const scheduleSave = useCallback(() => {
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
		}
		saveTimeoutRef.current = setTimeout(save, SAVE_DEBOUNCE_MS);
	}, [save]);

	const handleContentChange = useCallback(
		(newContent: string) => {
			setContent(newContent);
			pendingRef.current.content = newContent;

			if (!canEdit) return;

			if (newContent.length > MAX_CONTENT_LENGTH) {
				setSaveError(`Content exceeds maximum length (${newContent.length}/${MAX_CONTENT_LENGTH})`);
				setSaveStatus(SaveStatus.UNSAVED);
				return;
			}

			if (newContent !== lastSavedRef.current.content) {
				setSaveStatus(SaveStatus.UNSAVED);
				setSaveError(null);
				scheduleSave();
			} else if (pendingRef.current.title === lastSavedRef.current.title) {
				setSaveStatus(SaveStatus.SAVED);
			}
		},
		[canEdit, scheduleSave]
	);

	const handleTitleChange = useCallback(
		(newTitle: string) => {
			setTitle(newTitle);
			pendingRef.current.title = newTitle;

			if (!canEdit) return;

			if (newTitle !== lastSavedRef.current.title) {
				setSaveStatus(SaveStatus.UNSAVED);
				scheduleSave();
			} else if (pendingRef.current.content === lastSavedRef.current.content) {
				setSaveStatus(SaveStatus.SAVED);
			}
		},
		[canEdit, scheduleSave]
	);

	useEffect(() => {
		isMountedRef.current = true;

		return () => {
			isMountedRef.current = false;

			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}

			const { content: pendingContent, title: pendingTitle } = pendingRef.current;
			const { content: savedContent, title: savedTitle } = lastSavedRef.current;

			if ((pendingContent !== savedContent || pendingTitle !== savedTitle) && canEdit) {
				try {
					const data = JSON.stringify({
						fileId: file._id,
						content: pendingContent,
						title: pendingTitle,
					});
					navigator.sendBeacon('/api/save-on-unload', data);
				} catch {}
			}
		};
	}, [file._id, canEdit]);

	// Warn before leaving with unsaved changes
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			const { content: pendingContent, title: pendingTitle } = pendingRef.current;
			const { content: savedContent, title: savedTitle } = lastSavedRef.current;
			const hasUnsavedChanges = pendingContent !== savedContent || pendingTitle !== savedTitle;

			if (hasUnsavedChanges && canEdit) {
				e.preventDefault();
				return 'You have unsaved changes. Are you sure you want to leave?';
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [canEdit]);

	const handleSettingsUpdate = (updates: Partial<CodeFileInput>) => {
		const doUpdate = async () => {
			try {
				await updateCodeFileSettings(file._id, updates);
				if (updates.language) setLanguage(updates.language);
				if (updates.visibility) setVisibility(updates.visibility);
				if (updates.editMode) setEditMode(updates.editMode);
			} catch {
				alert('Failed to update settings');
			}
		};
		doUpdate();
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
