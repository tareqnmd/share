'use client';

import { updateCodeFileSettings } from '@/app/actions';
import { FileEditMode } from '@/enums/file-edit-mode.enum';
import { FileVisibility } from '@/enums/file-visibility.enum';
import { CodeFileInput } from '@/utils/validations';
import { useCallback, useState } from 'react';

interface UseFileSettingsOptions {
	fileId: string;
	initialLanguage: string;
	initialVisibility: FileVisibility;
	initialEditMode: FileEditMode;
}

interface UseFileSettingsReturn {
	language: string;
	visibility: FileVisibility;
	editMode: FileEditMode;
	updateSettings: (updates: Partial<CodeFileInput>) => Promise<void>;
}

export function useFileSettings({
	fileId,
	initialLanguage,
	initialVisibility,
	initialEditMode,
}: UseFileSettingsOptions): UseFileSettingsReturn {
	const [language, setLanguage] = useState(initialLanguage);
	const [visibility, setVisibility] = useState(initialVisibility);
	const [editMode, setEditMode] = useState(initialEditMode);

	const updateSettings = useCallback(
		async (updates: Partial<CodeFileInput>) => {
			try {
				await updateCodeFileSettings(fileId, updates);
				if (updates.language) setLanguage(updates.language);
				if (updates.visibility) setVisibility(updates.visibility);
				if (updates.editMode) setEditMode(updates.editMode);
			} catch {
				alert('Failed to update settings');
			}
		},
		[fileId]
	);

	return {
		language,
		visibility,
		editMode,
		updateSettings,
	};
}
