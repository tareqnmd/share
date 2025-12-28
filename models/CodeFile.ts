import { FileEditMode } from '@/enums/file-edit-mode.enum';
import { FileVisibility } from '@/enums/file-visibility.enum';
import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';

export interface ICodeFile extends Document {
	title: string;
	language: string;
	content: string;
	visibility: FileVisibility;
	editMode: FileEditMode;
	createdBy: mongoose.Types.ObjectId | IUser;
	createdAt: Date;
	updatedAt: Date;
}

const CodeFileSchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		language: { type: String, required: true, default: 'javascript' },
		content: { type: String, default: '' },
		visibility: {
			type: String,
			enum: Object.values(FileVisibility),
			default: FileVisibility.PUBLIC,
		},
		editMode: { type: String, enum: Object.values(FileEditMode), default: FileEditMode.OWNER },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{ timestamps: true }
);

const CodeFile: Model<ICodeFile> =
	mongoose.models.CodeFile || mongoose.model<ICodeFile>('CodeFile', CodeFileSchema);

export default CodeFile;
