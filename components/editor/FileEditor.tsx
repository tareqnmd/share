'use client';

import {
	deleteCodeFile,
	updateCodeFile,
	updateCodeFileSettings,
} from '@/app/actions';
import {
	EDIT_MODE_OPTIONS,
	LANGUAGE_OPTIONS,
	VISIBILITY_OPTIONS,
} from '@/lib/constants';
import { AppRoutes, FileEditMode, FileVisibility } from '@/types/enums';
import { CodeFileInput } from '@/utils/validations';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
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
	const router = useRouter();

	const [unsavedChanges, setUnsavedChanges] = useState(false);

	const handleSave = () => {
		startTransition(async () => {
			try {
				await updateCodeFile(file._id, content);
				setUnsavedChanges(false);
			} catch {
				alert('Failed to save content');
			}
		});
	};

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

	return (
		<div className="space-y-4">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
				<div className="flex-1 w-full">
					{canEdit ? (
						<input
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
							}}
							onBlur={() => handleSettingsUpdate({ title })}
							className="text-2xl font-bold bg-transparent border-none focus:ring-0 w-full p-0"
							placeholder="File Title"
						/>
					) : (
						<h1 className="text-2xl font-bold">{title}</h1>
					)}
					<div className="text-sm text-gray-500">
						Created by {file.createdBy.name} •{' '}
						{new Date(file.createdAt).toLocaleDateString()}
					</div>
				</div>

				<div className="flex flex-wrap gap-2 items-center">
					{canEdit && (
						<>
							<select
								value={language}
								onChange={(e) =>
									handleSettingsUpdate({ language: e.target.value })
								}
								className="border rounded p-1 text-sm"
							>
								{LANGUAGE_OPTIONS.map((option) => (
									<option
										key={option.value}
										value={option.value}
									>
										{option.label}
									</option>
								))}
							</select>

							<select
								value={visibility}
								onChange={(e) =>
									handleSettingsUpdate({
										visibility: e.target.value as FileVisibility,
									})
								}
								className="border rounded p-1 text-sm"
							>
								{VISIBILITY_OPTIONS.map((option) => (
									<option
										key={option.value}
										value={option.value}
									>
										{option.label}
									</option>
								))}
							</select>

							<select
								value={editMode}
								onChange={(e) =>
									handleSettingsUpdate({
										editMode: e.target.value as FileEditMode,
									})
								}
								className="border rounded p-1 text-sm"
							>
								{EDIT_MODE_OPTIONS.map((option) => (
									<option
										key={option.value}
										value={option.value}
									>
										{option.label}
									</option>
								))}
							</select>

							<button
								onClick={handleSave}
								disabled={!unsavedChanges || isSaving}
								className="bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
							>
								{isSaving ? 'Saving...' : 'Save'}
							</button>

							{file.createdBy._id === currentUserId && (
								<button
									onClick={handleDelete}
									disabled={isDeleting}
									className="bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
								>
									Delete
								</button>
							)}
						</>
					)}
					{!canEdit && (
						<div className="text-sm text-gray-500 italic">Read Only</div>
					)}
				</div>
			</div>

			<CodeEditor
				code={content}
				language={language}
				readOnly={!canEdit}
				onChange={(val) => {
					setContent(val || '');
					setUnsavedChanges(true);
				}}
			/>
		</div>
	);
}
