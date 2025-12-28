'use server';

import { AppRoutes } from '@/enums/app-routes.enum';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { logger } from '@/lib/logger';
import { canCreateFile, canEditFile } from '@/lib/permissions';
import CodeFile from '@/models/CodeFile';
import { CodeFileInput, codeFileSchema, objectIdSchema } from '@/utils/validations';
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
	const start = performance.now();

	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			logger.security('unauthorized_create_attempt');
			throw new Error('Unauthorized');
		}

		await connectDB();
		const canCreate = await canCreateFile(session.user.id);

		if (!canCreate) {
			logger.warn('File limit reached', { userId: session.user.id, action: 'create-file' });
			throw new Error('File limit reached. You can only create up to 5 files.');
		}

		const validated = codeFileSchema.parse(data);

		const newFile = await CodeFile.create({
			...validated,
			createdBy: session.user.id,
		});

		const duration_ms = Math.round(performance.now() - start);
		logger.action('file.create', 'success', {
			userId: session.user.id,
			fileId: newFile._id.toString(),
			duration_ms,
		});

		revalidatePath(AppRoutes.DASHBOARD);
		return newFile._id.toString();
	} catch (error) {
		if (error instanceof z.ZodError) {
			const err = error as unknown as ZodErrorLike;
			const issues = err.errors || err.issues || [];
			throw new Error(`Validation failed: ${issues.map((e) => e.message).join(', ')}`);
		}
		throw error;
	}
}

interface UpdateCodeFileData {
	content: string;
	title?: string;
}

export async function updateCodeFile(id: string, data: UpdateCodeFileData) {
	const start = performance.now();

	try {
		const validatedId = validateFileId(id);

		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			logger.security('unauthorized_update_attempt', { fileId: id });
			throw new Error('Unauthorized');
		}

		await connectDB();
		const canEdit = await canEditFile(session.user.id, validatedId);
		if (!canEdit) {
			logger.security('forbidden_update_attempt', { userId: session.user.id, fileId: id });
			throw new Error('Forbidden');
		}

		const updateData: { content: string; title?: string } = { content: data.content };
		if (data.title !== undefined) {
			updateData.title = data.title;
		}

		const result = await CodeFile.findByIdAndUpdate(validatedId, updateData, { new: true });

		if (!result) {
			throw new Error('File not found');
		}

		const duration_ms = Math.round(performance.now() - start);
		logger.debug('File updated', { userId: session.user.id, fileId: id, duration_ms });

		if (data.title !== undefined) {
			revalidatePath(AppRoutes.DASHBOARD);
		}

		return { success: true };
	} catch (error) {
		logger.error('Failed to update file', error, { fileId: id });
		throw error instanceof Error ? error : new Error('Failed to update file');
	}
}

export async function updateCodeFileSettings(id: string, data: Partial<CodeFileInput>) {
	try {
		const validatedId = validateFileId(id);

		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			logger.security('unauthorized_settings_update', { fileId: id });
			throw new Error('Unauthorized');
		}

		await connectDB();
		const canEdit = await canEditFile(session.user.id, validatedId);
		if (!canEdit) {
			logger.security('forbidden_settings_update', { userId: session.user.id, fileId: id });
			throw new Error('Forbidden');
		}

		const validated = codeFileSchema.partial().parse(data);

		const result = await CodeFile.findByIdAndUpdate(validatedId, validated, {
			new: true,
		});
		if (!result) {
			throw new Error('File not found');
		}

		logger.action('file.update_settings', 'success', {
			userId: session.user.id,
			fileId: id,
			metadata: { changes: Object.keys(data) },
		});

		if (data.visibility || data.editMode) {
			revalidatePath(`${AppRoutes.CODE}/${validatedId}`);
		}
		revalidatePath(AppRoutes.DASHBOARD);
		return { success: true };
	} catch (error) {
		if (error instanceof z.ZodError) {
			const err = error as unknown as ZodErrorLike;
			const issues = err.errors || err.issues || [];
			throw new Error(`Validation failed: ${issues.map((e) => e.message).join(', ')}`);
		}
		logger.error('Failed to update file settings', error, { fileId: id });
		throw error instanceof Error ? error : new Error('Failed to update file settings');
	}
}

export async function deleteCodeFile(id: string) {
	try {
		const validatedId = validateFileId(id);

		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			logger.security('unauthorized_delete_attempt', { fileId: id });
			throw new Error('Unauthorized');
		}

		await connectDB();
		const file = await CodeFile.findById(validatedId);

		if (!file) throw new Error('File not found');

		if (file.createdBy.toString() !== session.user.id) {
			logger.security('forbidden_delete_attempt', { userId: session.user.id, fileId: id });
			throw new Error('Forbidden');
		}

		await CodeFile.findByIdAndDelete(validatedId);

		logger.action('file.delete', 'success', { userId: session.user.id, fileId: id });

		revalidatePath(AppRoutes.DASHBOARD);
		return { success: true };
	} catch (error) {
		logger.error('Failed to delete file', error, { fileId: id });
		throw error instanceof Error ? error : new Error('Failed to delete file');
	}
}
