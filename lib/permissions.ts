import CodeFile from '@/models/CodeFile';
import User from '@/models/User';
import { FileEditMode, UserRole } from '@/types/enums';
import { MAX_FILES_PER_USER } from './constants';
import connectDB from './db';

export async function canCreateFile(userId: string): Promise<boolean> {
	await connectDB();
	const user = await User.findById(userId);
	if (!user) return false;

	if (user.role === UserRole.ADMIN) return true;

	const fileCount = await CodeFile.countDocuments({ createdBy: userId });
	return fileCount < MAX_FILES_PER_USER;
}

export async function canEditFile(userId: string, fileId: string): Promise<boolean> {
	await connectDB();
	const user = await User.findById(userId);
	if (!user) return false;

	const file = await CodeFile.findById(fileId);
	if (!file) return false;

	if (file.createdBy.toString() === userId) return true;

	if (file.editMode === FileEditMode.COLLABORATIVE) return true;

	return false;
}
