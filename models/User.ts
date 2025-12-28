import { UserRole } from '@/enums/user-role.enum';
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
	name: string;
	email: string;
	image?: string;
	providerId: string;
	role: UserRole;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		image: { type: String },
		providerId: { type: String, required: true, unique: true },
		role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
	},
	{ timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
