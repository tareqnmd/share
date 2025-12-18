import User from "@/models/User";
import CodeFile from "@/models/CodeFile";
import connectDB from "./db";

export async function canCreateFile(userId: string): Promise<boolean> {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) return false;

  if (user.role === 'admin') return true;

  const fileCount = await CodeFile.countDocuments({ createdBy: userId });
  return fileCount < 5;
}

export async function canEditFile(userId: string, fileId: string): Promise<boolean> {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) return false;

  const file = await CodeFile.findById(fileId);
  if (!file) return false;

  // Owner can always edit
  if (file.createdBy.toString() === userId) return true;

  // Collaborative public files can be edited by any authenticated user
  if (file.visibility === 'public' && file.editMode === 'collaborative') return true;

  return false;
}

