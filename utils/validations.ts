import { MAX_CONTENT_LENGTH, MAX_TITLE_LENGTH, MIN_TITLE_LENGTH } from '@/lib/constants';
import { FileEditMode, FileVisibility } from '@/types/enums';
import { z } from 'zod';

const objectIdRegex = /^[a-f\d]{24}$/i;

export const objectIdSchema = z.string().regex(objectIdRegex, 'Invalid file ID format');

const sanitizeContent = (content: string): string => {
	return content.replace(/\x00/g, '').slice(0, MAX_CONTENT_LENGTH);
};

export const codeFileSchema = z.object({
	title: z
		.string()
		.min(MIN_TITLE_LENGTH, 'Title is required')
		.max(MAX_TITLE_LENGTH, `Title must be ${MAX_TITLE_LENGTH} characters or less`)
		.transform((val) => val.trim()),
	language: z.string().min(1, 'Language is required'),
	content: z
		.string()
		.max(MAX_CONTENT_LENGTH, `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters`)
		.optional()
		.default('')
		.transform(sanitizeContent),
	visibility: z.nativeEnum(FileVisibility),
	editMode: z.nativeEnum(FileEditMode),
});

export const contentUpdateSchema = z.object({
	content: z
		.string()
		.max(MAX_CONTENT_LENGTH, `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters`)
		.transform(sanitizeContent),
});

export type CodeFileInput = z.infer<typeof codeFileSchema>;
export type ContentUpdate = z.infer<typeof contentUpdateSchema>;
