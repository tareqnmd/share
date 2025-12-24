import CreateFileButton from '@/components/dashboard/CreateFileButton';
import FileCard from '@/components/dashboard/FileCard';
import StorageQuota from '@/components/dashboard/StorageQuota';
import { authOptions } from '@/lib/auth';
import { MAX_FILES_PER_USER } from '@/lib/constants';
import connectDB from '@/lib/db';
import { dashboardMetadata } from '@/lib/seo';
import CodeFile from '@/models/CodeFile';
import { AppRoutes, UserRole } from '@/types/enums';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = dashboardMetadata;

async function getFiles(userId: string) {
	await connectDB();
	const files = await CodeFile.find({ createdBy: userId }).sort({ createdAt: -1 });
	return files;
}

export default async function Dashboard() {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		redirect(AppRoutes.HOME);
	}

	const files = await getFiles(session.user.id);
	const fileCount = files.length;
	const isUser = session.user.role === UserRole.USER;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold text-neutral-50">My Files</h1>
				<CreateFileButton disabled={isUser && fileCount >= MAX_FILES_PER_USER} />
			</div>

			{isUser && <StorageQuota fileCount={fileCount} />}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{files.map((file) => (
					<FileCard
						key={file._id.toString()}
						id={file._id.toString()}
						title={file.title}
						language={file.language}
						visibility={file.visibility}
						updatedAt={file.updatedAt.toISOString()}
					/>
				))}
				{files.length === 0 && (
					<p className="text-neutral-400 col-span-full text-center py-10">
						You haven&apos;t created any files yet.
					</p>
				)}
			</div>
		</div>
	);
}
