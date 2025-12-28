import { SaveStatus } from '../enums/save-status.enum';
import { CodeFile } from './file.types';

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
