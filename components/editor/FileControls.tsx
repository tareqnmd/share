'use client';

import {
	GlobeIcon,
	LockIcon,
	SettingsIcon,
	TrashIcon,
	UserIcon,
	UsersIcon,
} from '@/components/icons';
import DropdownMenu from '@/components/ui/DropdownMenu';
import Select from '@/components/ui/Select';
import { DropdownItemVariant } from '@/enums/dropdown-item-variant.enum';
import { FileEditMode } from '@/enums/file-edit-mode.enum';
import { FileVisibility } from '@/enums/file-visibility.enum';
import { DropdownMenuSection } from '@/interfaces/dropdown.types';
import { FileControlsProps } from '@/interfaces/file-controls.types';
import { LANGUAGE_OPTIONS } from '@/lib/constants';

export default function FileControls({
	language,
	visibility,
	editMode,
	canEdit,
	isOwner,
	isDeleting,
	onSettingsUpdate,
	onDelete,
}: FileControlsProps) {
	const menuSections: DropdownMenuSection[] = [
		{
			title: 'Visibility',
			items: [
				{
					label: 'Public',
					onClick: () => onSettingsUpdate({ visibility: FileVisibility.PUBLIC }),
					active: visibility === FileVisibility.PUBLIC,
					icon: <GlobeIcon />,
				},
				{
					label: 'Private',
					onClick: () => onSettingsUpdate({ visibility: FileVisibility.PRIVATE }),
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
					onClick: () => onSettingsUpdate({ editMode: FileEditMode.OWNER }),
					active: editMode === FileEditMode.OWNER,
					icon: <UserIcon />,
				},
				{
					label: 'Collaborative',
					onClick: () => onSettingsUpdate({ editMode: FileEditMode.COLLABORATIVE }),
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
								onClick: onDelete,
								variant: DropdownItemVariant.DANGER,
								disabled: isDeleting,
								icon: <TrashIcon />,
							},
						],
					},
				]
			: []),
	];

	if (!canEdit) {
		return (
			<div className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-400 ring-1 ring-neutral-700">
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
						d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
					/>
				</svg>
				<span>Read Only</span>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<Select
				options={LANGUAGE_OPTIONS}
				value={language}
				onChange={(e) => onSettingsUpdate({ language: e.target.value })}
				className="w-auto min-w-[120px]"
			/>
			<DropdownMenu sections={menuSections} trigger={<SettingsIcon className="w-5 h-5" />} />
		</div>
	);
}
