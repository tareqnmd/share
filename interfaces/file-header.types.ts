import { FileVisibility } from '../enums/file-visibility.enum';
import { SaveStatus } from '../enums/save-status.enum';

export interface FileHeaderProps {
	title: string;
	canEdit: boolean;
	onTitleChange: (value: string) => void;
}

export interface FileMetaInfoProps {
	visibility: FileVisibility;
	createdByName: string;
	createdAt: string;
	canEdit: boolean;
	saveStatus: SaveStatus;
	isSaving: boolean;
	saveError: string | null;
}
