import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface ICodeFile extends Document {
  title: string;
  language: string;
  content: string;
  visibility: 'public' | 'private';
  editMode: 'owner' | 'collaborative';
  createdBy: mongoose.Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const CodeFileSchema: Schema = new Schema({
  title: { type: String, required: true },
  language: { type: String, required: true, default: 'javascript' },
  content: { type: String, default: '' },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  editMode: { type: String, enum: ['owner', 'collaborative'], default: 'owner' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const CodeFile: Model<ICodeFile> = mongoose.models.CodeFile || mongoose.model<ICodeFile>('CodeFile', CodeFileSchema);

export default CodeFile;

