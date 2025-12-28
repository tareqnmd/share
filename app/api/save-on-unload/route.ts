'use server';

import { HttpStatus } from '@/enums/http-status.enum';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { canEditFile } from '@/lib/permissions';
import CodeFile from '@/models/CodeFile';
import { objectIdSchema } from '@/utils/validations';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: HttpStatus.UNAUTHORIZED });
		}

		const body = await request.json();
		const { fileId, content, title } = body;

		const idResult = objectIdSchema.safeParse(fileId);
		if (!idResult.success) {
			return NextResponse.json({ error: 'Invalid file ID' }, { status: HttpStatus.BAD_REQUEST });
		}

		if (typeof content !== 'string') {
			return NextResponse.json({ error: 'Invalid content' }, { status: HttpStatus.BAD_REQUEST });
		}

		await connectDB();

		const hasPermission = await canEditFile(session.user.id, idResult.data);
		if (!hasPermission) {
			return NextResponse.json({ error: 'Forbidden' }, { status: HttpStatus.FORBIDDEN });
		}

		if (!content || content.trim() === '') {
			const existingFile = await CodeFile.findById(idResult.data).select('content');
			if (existingFile?.content && existingFile.content.trim() !== '') {
				return NextResponse.json({ success: true, skipped: true });
			}
		}

		const updateData: { content: string; title?: string } = { content };
		if (title && typeof title === 'string') {
			updateData.title = title;
		}

		const result = await CodeFile.findByIdAndUpdate(idResult.data, updateData, { new: true });

		if (!result) {
			return NextResponse.json({ error: 'File not found' }, { status: HttpStatus.NOT_FOUND });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Save on unload failed:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: HttpStatus.INTERNAL_SERVER_ERROR }
		);
	}
}
