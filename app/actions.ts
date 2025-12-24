'use server';

import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { canCreateFile, canEditFile } from '@/lib/permissions';
import CodeFile from '@/models/CodeFile';
import { AppRoutes } from '@/types/enums';
import {
	CodeFileInput,
	codeFileSchema,
	contentUpdateSchema,
	objectIdSchema,
} from '@/utils/validations';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

interface ZodErrorLike {
	errors?: { message: string }[];
	issues?: { message: string }[];
}

function validateFileId(id: string): string {
	const result = objectIdSchema.safeParse(id);
	if (!result.success) {
		throw new Error('Invalid file ID');
	}
	return result.data;
}

export async function createCodeFile(data: CodeFileInput) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			throw new Error('Unauthorized');
		}

		await connectDB();
		const canCreate = await canCreateFile(session.user.id);

		if (!canCreate) {
			throw new Error('File limit reached. You can only create up to 5 files.');
		}

		const validated = codeFileSchema.parse(data);

		const newFile = await CodeFile.create({
			...validated,
			createdBy: session.user.id,
		});

		revalidatePath(AppRoutes.DASHBOARD);
		return newFile._id.toString();
	} catch (error) {
		if (error instanceof z.ZodError) {
			const err = error as unknown as ZodErrorLike;
			const issues = err.errors || err.issues || [];
			throw new Error(
				`Validation failed: ${issues.map((e) => e.message).join(', ')}`
			);
		}
		throw error;
	}
}

export async function updateCodeFile(id: string, content: string) {
	try {
		const validatedId = validateFileId(id);

		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			throw new Error('Unauthorized');
		}

		const validatedContent = contentUpdateSchema.parse({ content });

		await connectDB();
		const canEdit = await canEditFile(session.user.id, validatedId);
		if (!canEdit) {
			throw new Error('Forbidden');
		}

		const result = await CodeFile.findByIdAndUpdate(
			validatedId,
			{ content: validatedContent.content },
			{ new: true }
		);

		if (!result) {
			throw new Error('File not found');
		}

		revalidatePath(`${AppRoutes.CODE}/${validatedId}`);
		return { success: true, contentLength: validatedContent.content.length };
	} catch (error) {
		if (error instanceof z.ZodError) {
			const err = error as unknown as ZodErrorLike;
			const issues = err.errors || err.issues || [];
			throw new Error(
				`Content validation failed: ${issues.map((e) => e.message).join(', ')}`
			);
		}
		console.error('Failed to update file content:', error);
		throw error instanceof Error
			? error
			: new Error('Failed to update file content');
	}
}

export async function updateCodeFileSettings(
	id: string,
	data: Partial<CodeFileInput>
) {
	try {
		const validatedId = validateFileId(id);

		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			throw new Error('Unauthorized');
		}

		await connectDB();
		const canEdit = await canEditFile(session.user.id, validatedId);
		if (!canEdit) {
			throw new Error('Forbidden');
		}

		const validated = codeFileSchema.partial().parse(data);

		const result = await CodeFile.findByIdAndUpdate(validatedId, validated, {
			new: true,
		});
		if (!result) {
			throw new Error('File not found');
		}

		revalidatePath(`${AppRoutes.CODE}/${validatedId}`);
		revalidatePath(AppRoutes.DASHBOARD);
		return { success: true };
	} catch (error) {
		if (error instanceof z.ZodError) {
			const err = error as unknown as ZodErrorLike;
			const issues = err.errors || err.issues || [];
			throw new Error(
				`Validation failed: ${issues.map((e) => e.message).join(', ')}`
			);
		}
		console.error('Failed to update file settings:', error);
		throw error instanceof Error
			? error
			: new Error('Failed to update file settings');
	}
}

export async function deleteCodeFile(id: string) {
	try {
		const validatedId = validateFileId(id);

		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			throw new Error('Unauthorized');
		}

		await connectDB();
		const file = await CodeFile.findById(validatedId);

		if (!file) throw new Error('File not found');

		if (file.createdBy.toString() !== session.user.id) {
			throw new Error('Forbidden');
		}

		await CodeFile.findByIdAndDelete(validatedId);
		revalidatePath(AppRoutes.DASHBOARD);
		return { success: true };
	} catch (error) {
		console.error('Failed to delete file:', error);
		throw error instanceof Error ? error : new Error('Failed to delete file');
	}
}
