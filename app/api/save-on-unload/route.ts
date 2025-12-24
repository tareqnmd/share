'use server';

import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { canEditFile } from '@/lib/permissions';
import CodeFile from '@/models/CodeFile';
import { contentUpdateSchema, objectIdSchema } from '@/utils/validations';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const { fileId, content } = body;

		const idResult = objectIdSchema.safeParse(fileId);
		if (!idResult.success) {
			return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
		}

		const contentResult = contentUpdateSchema.safeParse({ content });
		if (!contentResult.success) {
			return NextResponse.json(
				{
					error: contentResult.error.issues
						.map((e: { message: string }) => e.message)
						.join(', '),
				},
				{ status: 400 }
			);
		}

		await connectDB();

		const hasPermission = await canEditFile(session.user.id, idResult.data);
		if (!hasPermission) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		const result = await CodeFile.findByIdAndUpdate(
			idResult.data,
			{ content: contentResult.data.content },
			{ new: true }
		);

		if (!result) {
			return NextResponse.json({ error: 'File not found' }, { status: 404 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Save on unload failed:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
