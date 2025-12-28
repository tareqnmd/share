import { FileEditMode } from '../enums/file-edit-mode.enum';
import { FileVisibility } from '../enums/file-visibility.enum';

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
