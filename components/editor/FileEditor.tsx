'use client';

import { deleteCodeFile, updateCodeFileSettings } from '@/app/actions';
import CopyButton from '@/components/ui/CopyButton';
import ShareButton from '@/components/ui/ShareButton';
import { AppRoutes } from '@/enums/app-routes.enum';
import { FileEditMode } from '@/enums/file-edit-mode.enum';
import { FileVisibility } from '@/enums/file-visibility.enum';
import { useAutoSave } from '@/hooks';
import { FileEditorProps } from '@/interfaces/editor.types';
import { CodeFileInput } from '@/utils/validations';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import CodeEditor from './CodeEditor';
import FileControls from './FileControls';
import FileHeader, { FileMetaInfo } from './FileHeader';

export default function FileEditor({ file, canEdit, currentUserId }: FileEditorProps) {
	const [language, setLanguage] = useState(file.language);
	const [visibility, setVisibility] = useState<FileVisibility>(file.visibility);
	const [editMode, setEditMode] = useState<FileEditMode>(file.editMode);
	const [isDeleting, startDeleteTransition] = useTransition();
	const router = useRouter();

	const { content, title, isSaving, saveStatus, saveError, setContent, setTitle, resetState } =
		useAutoSave({
			fileId: file._id,
			initialContent: file.content,
			initialTitle: file.title,
			canEdit,
		});

	const [prevFileId, setPrevFileId] = useState(file._id);
	const isOwner = file.createdBy._id === currentUserId;

	if (file._id !== prevFileId) {
		setPrevFileId(file._id);
		resetState(file.content, file.title);
		setLanguage(file.language);
		setVisibility(file.visibility);
		setEditMode(file.editMode);
	}

	const handleSettingsUpdate = async (updates: Partial<CodeFileInput>) => {
		try {
			await updateCodeFileSettings(file._id, updates);
			if (updates.language) setLanguage(updates.language);
			if (updates.visibility) setVisibility(updates.visibility);
			if (updates.editMode) setEditMode(updates.editMode);
		} catch {
			alert('Failed to update settings');
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
				<FileHeader title={title} canEdit={canEdit} onTitleChange={setTitle} />

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
				<div className="absolute top-3 right-3 z-10 flex items-center gap-2">
					<ShareButton />
					<CopyButton text={content} />
				</div>
				<CodeEditor
					code={content}
					language={language}
					readOnly={!canEdit}
					onChange={(val) => setContent(val || '')}
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
