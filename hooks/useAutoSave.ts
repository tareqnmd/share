'use client';

import { updateCodeFile } from '@/app/actions';
import { SaveStatus } from '@/enums/save-status.enum';
import { MAX_CONTENT_LENGTH, SAVE_DEBOUNCE_MS } from '@/lib/constants';
import { useCallback, useEffect, useRef, useState } from 'react';

interface AutoSaveState {
	content: string;
	title: string;
}

interface UseAutoSaveOptions {
	fileId: string;
	initialContent: string;
	initialTitle: string;
	canEdit: boolean;
}

interface UseAutoSaveReturn {
	content: string;
	title: string;
	isSaving: boolean;
	saveStatus: SaveStatus;
	saveError: string | null;
	setContent: (content: string) => void;
	setTitle: (title: string) => void;
	resetState: (content: string, title: string) => void;
}

export function useAutoSave({
	fileId,
	initialContent,
	initialTitle,
	canEdit,
}: UseAutoSaveOptions): UseAutoSaveReturn {
	const [content, setContentState] = useState(initialContent);
	const [title, setTitleState] = useState(initialTitle);
	const [isSaving, setIsSaving] = useState(false);
	const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.SAVED);
	const [saveError, setSaveError] = useState<string | null>(null);

	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastSavedRef = useRef<AutoSaveState>({ content: initialContent, title: initialTitle });
	const pendingRef = useRef<AutoSaveState>({ content: initialContent, title: initialTitle });
	const isMountedRef = useRef(true);

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
			await updateCodeFile(fileId, {
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
	}, [fileId]);

	const scheduleSave = useCallback(() => {
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
		}
		saveTimeoutRef.current = setTimeout(save, SAVE_DEBOUNCE_MS);
	}, [save]);

	const setContent = useCallback(
		(newContent: string) => {
			setContentState(newContent);
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

	const setTitle = useCallback(
		(newTitle: string) => {
			setTitleState(newTitle);
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

	const resetState = useCallback((newContent: string, newTitle: string) => {
		setContentState(newContent);
		setTitleState(newTitle);
		setSaveStatus(SaveStatus.SAVED);
		setSaveError(null);
		lastSavedRef.current = { content: newContent, title: newTitle };
		pendingRef.current = { content: newContent, title: newTitle };
	}, []);

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
						fileId,
						content: pendingContent,
						title: pendingTitle,
					});
					navigator.sendBeacon('/api/save-on-unload', data);
				} catch {}
			}
		};
	}, [fileId, canEdit]);

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

	return {
		content,
		title,
		isSaving,
		saveStatus,
		saveError,
		setContent,
		setTitle,
		resetState,
	};
}
