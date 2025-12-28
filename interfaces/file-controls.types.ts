import { CodeFileInput } from '@/utils/validations';
import { FileEditMode } from '../enums/file-edit-mode.enum';
import { FileVisibility } from '../enums/file-visibility.enum';

export interface FileControlsProps {
	language: string;
	visibility: FileVisibility;
	editMode: FileEditMode;
	canEdit: boolean;
	isOwner: boolean;
	isDeleting: boolean;
	onSettingsUpdate: (updates: Partial<CodeFileInput>) => void;
	onDelete: () => void;
}
