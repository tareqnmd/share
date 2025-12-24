'use client';

import {
	GlobeIcon,
	LockIcon,
	TrashIcon,
	UserIcon,
	UsersIcon,
} from '@/components/icons';
import DropdownMenu from '@/components/ui/DropdownMenu';
import Select from '@/components/ui/Select';
import { LANGUAGE_OPTIONS } from '@/lib/constants';
import {
	DropdownItemVariant,
	FileEditMode,
	FileVisibility,
} from '@/types/enums';
import { DropdownMenuSection } from '@/types/types';
import { CodeFileInput } from '@/utils/validations';

interface FileControlsProps {
	language: string;
	visibility: FileVisibility;
	editMode: FileEditMode;
	canEdit: boolean;
	isOwner: boolean;
	isDeleting: boolean;
	onSettingsUpdate: (updates: Partial<CodeFileInput>) => void;
	onDelete: () => void;
}

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
					onClick: () =>
						onSettingsUpdate({ visibility: FileVisibility.PUBLIC }),
					active: visibility === FileVisibility.PUBLIC,
					icon: <GlobeIcon />,
				},
				{
					label: 'Private',
					onClick: () =>
						onSettingsUpdate({ visibility: FileVisibility.PRIVATE }),
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
					onClick: () =>
						onSettingsUpdate({ editMode: FileEditMode.COLLABORATIVE }),
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
		return <div className="text-sm text-neutral-500 italic">Read Only</div>;
	}

	return (
		<>
			<Select
				options={LANGUAGE_OPTIONS}
				value={language}
				onChange={(e) => onSettingsUpdate({ language: e.target.value })}
			/>
			<DropdownMenu sections={menuSections} />
		</>
	);
}

