'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import CodeFile from "@/models/CodeFile";
import { codeFileSchema, CodeFileInput } from "@/utils/validations";
import { canCreateFile, canEditFile } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function createCodeFile(data: CodeFileInput) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  await connectDB();
  const canCreate = await canCreateFile(session.user.id);
  
  if (!canCreate) {
    throw new Error("File limit reached. You can only create up to 5 files.");
  }

  const validated = codeFileSchema.parse(data);

  const newFile = await CodeFile.create({
    ...validated,
    createdBy: session.user.id,
  });

  revalidatePath('/dashboard');
  return newFile._id.toString();
}

export async function updateCodeFile(id: string, content: string) {
    // Specialized for editor autosave/save
    // Only content
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }
  
    const canEdit = await canEditFile(session.user.id, id);
    if (!canEdit) {
      throw new Error("Forbidden");
    }
  
    await CodeFile.findByIdAndUpdate(id, { content });
    revalidatePath(`/code/${id}`);
}

export async function updateCodeFileSettings(id: string, data: Partial<CodeFileInput>) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const canEdit = await canEditFile(session.user.id, id);
  if (!canEdit) {
    throw new Error("Forbidden");
  }

  const validated = codeFileSchema.partial().parse(data);

  await CodeFile.findByIdAndUpdate(id, validated);
  revalidatePath(`/code/${id}`);
  revalidatePath('/dashboard');
}

export async function deleteCodeFile(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
     throw new Error("Unauthorized");
  }
  
  await connectDB();
  const file = await CodeFile.findById(id);
  
  if (!file) throw new Error("File not found");
  
  if (file.createdBy.toString() !== session.user.id) {
      throw new Error("Forbidden");
  }
  
  await CodeFile.findByIdAndDelete(id);
  revalidatePath('/dashboard');
}

