'use server';

import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { canCreateFile, canEditFile } from '@/lib/permissions';
import CodeFile from '@/models/CodeFile';
import { AppRoutes } from '@/types/enums';
import { CodeFileInput, codeFileSchema } from '@/utils/validations';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

interface ZodErrorLike {
	errors?: { message: string }[];
	issues?: { message: string }[];
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
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			throw new Error('Unauthorized');
		}

		const canEdit = await canEditFile(session.user.id, id);
		if (!canEdit) {
			throw new Error('Forbidden');
		}

		await CodeFile.findByIdAndUpdate(id, { content });
		revalidatePath(`${AppRoutes.CODE}/${id}`);
	} catch (error) {
		console.error('Failed to update file content:', error);
		throw new Error('Failed to update file content');
	}
}

export async function updateCodeFileSettings(
	id: string,
	data: Partial<CodeFileInput>
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			throw new Error('Unauthorized');
		}

		const canEdit = await canEditFile(session.user.id, id);
		if (!canEdit) {
			throw new Error('Forbidden');
		}

		const validated = codeFileSchema.partial().parse(data);

		await CodeFile.findByIdAndUpdate(id, validated);
		revalidatePath(`${AppRoutes.CODE}/${id}`);
		revalidatePath(AppRoutes.DASHBOARD);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const err = error as unknown as ZodErrorLike;
			const issues = err.errors || err.issues || [];
			throw new Error(
				`Validation failed: ${issues.map((e) => e.message).join(', ')}`
			);
		}
		console.error('Failed to update file settings:', error);
		throw new Error('Failed to update file settings');
	}
}

export async function deleteCodeFile(id: string) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			throw new Error('Unauthorized');
		}

		await connectDB();
		const file = await CodeFile.findById(id);

		if (!file) throw new Error('File not found');

		if (file.createdBy.toString() !== session.user.id) {
			throw new Error('Forbidden');
		}

		await CodeFile.findByIdAndDelete(id);
		revalidatePath(AppRoutes.DASHBOARD);
	} catch (error) {
		console.error('Failed to delete file:', error);
		throw new Error('Failed to delete file');
	}
}
