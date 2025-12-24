'use client';

import {
	deleteCodeFile,
	updateCodeFile,
	updateCodeFileSettings,
} from '@/app/actions';
import CopyButton from '@/components/ui/CopyButton';
import DropdownMenu from '@/components/ui/DropdownMenu';
import Select from '@/components/ui/Select';
import { GlobeIcon, LockIcon, UserIcon, UsersIcon, TrashIcon } from '@/components/icons';
import { LANGUAGE_OPTIONS } from '@/lib/constants';
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

interface SaveStatusIndicatorProps {
	status: 'saved' | 'saving' | 'unsaved';
	isSaving: boolean;
	canEdit: boolean;
}

function SaveStatusIndicator({ status, isSaving, canEdit }: SaveStatusIndicatorProps) {
	if (!canEdit) return null;

	return (
		<div className="flex items-center gap-2 text-xs">
			{status === 'saving' && (
				<>
					<div className="w-2 h-2 rounded-full bg-warning-500 animate-pulse" />
					<span className="text-warning-400">Saving...</span>
				</>
			)}
			{status === 'saved' && (
				<>
					<div className="w-2 h-2 rounded-full bg-success-500" />
					<span className="text-success-400">Saved</span>
				</>
			)}
			{status === 'unsaved' && !isSaving && (
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
	const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
	const router = useRouter();
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastSavedContentRef = useRef(file.content);

	const isOwner = file.createdBy._id === currentUserId;

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

	const handleContentChange = useCallback((newContent: string) => {
		setContent(newContent);
		
		if (!canEdit || newContent === lastSavedContentRef.current) return;

		setSaveStatus('unsaved');

		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
		}

		saveTimeoutRef.current = setTimeout(() => {
			saveContent(newContent);
		}, 1000);
	}, [canEdit, saveContent]);

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

	const menuSections = [
		{
			title: 'Visibility',
			items: [
				{
					label: 'Public',
					onClick: () => handleSettingsUpdate({ visibility: FileVisibility.PUBLIC }),
					active: visibility === FileVisibility.PUBLIC,
					icon: <GlobeIcon />,
				},
				{
					label: 'Private',
					onClick: () => handleSettingsUpdate({ visibility: FileVisibility.PRIVATE }),
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
					onClick: () => handleSettingsUpdate({ editMode: FileEditMode.COLLABORATIVE }),
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
								variant: 'danger' as const,
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
						<SaveStatusIndicator status={saveStatus} isSaving={isSaving} canEdit={canEdit} />
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
