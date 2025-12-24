import { ReactNode } from 'react';
import {
	AvatarSize,
	ButtonSize,
	ButtonVariant,
	DropdownItemVariant,
	FileEditMode,
	FileVisibility,
	SaveStatus,
} from './enums';

// UI Components
export interface ButtonProps {
	variant?: ButtonVariant;
	size?: ButtonSize;
	children: ReactNode;
	isLoading?: boolean;
}

export interface AvatarProps {
	src?: string | null;
	alt: string;
	size?: AvatarSize;
	className?: string;
}

export interface SelectOption {
	value: string;
	label: string;
}

export interface DropdownMenuItem {
	label: string;
	onClick: () => void;
	icon?: ReactNode;
	variant?: DropdownItemVariant;
	disabled?: boolean;
	active?: boolean;
}

export interface DropdownMenuSection {
	title?: string;
	items: DropdownMenuItem[];
}

// File/Editor
export interface FileAuthor {
	_id: string;
	name: string;
}

export interface CodeFile {
	_id: string;
	title: string;
	content: string;
	language: string;
	visibility: FileVisibility;
	editMode: FileEditMode;
	createdBy: FileAuthor;
	createdAt: string;
	updatedAt: string;
}

export interface FileEditorProps {
	file: CodeFile;
	canEdit: boolean;
	currentUserId?: string;
}

export interface SaveStatusIndicatorProps {
	status: SaveStatus;
	isSaving: boolean;
	canEdit: boolean;
	error?: string | null;
}

export interface CodeEditorProps {
	code: string;
	language: string;
	onChange?: (value: string | undefined) => void;
	readOnly?: boolean;
}
