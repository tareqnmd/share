import User from "@/models/User";
import CodeFile from "@/models/CodeFile";
import connectDB from "./db";
import { UserRole, FileVisibility, FileEditMode } from "@/types/enums";

export async function canCreateFile(userId: string): Promise<boolean> {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) return false;

  if (user.role === UserRole.ADMIN) return true;

  const fileCount = await CodeFile.countDocuments({ createdBy: userId });
  return fileCount < 5;
}

export async function canEditFile(userId: string, fileId: string): Promise<boolean> {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) return false;

  const file = await CodeFile.findById(fileId);
  if (!file) return false;

  if (file.createdBy.toString() === userId) return true;

  if (file.visibility === FileVisibility.PUBLIC && file.editMode === FileEditMode.COLLABORATIVE) return true;

  return false;
}
