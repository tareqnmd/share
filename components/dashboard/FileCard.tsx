'use client';

import { deleteCodeFile } from '@/app/actions/file.actions';
import { TrashIcon } from '@/components/icons';
import { AppRoutes } from '@/enums/app-routes.enum';
import { FileVisibility } from '@/enums/file-visibility.enum';
import { FileCardProps } from '@/interfaces/file-card.types';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function FileCard({ id, title, language, visibility, updatedAt }: FileCardProps) {
	const isPublic = visibility === FileVisibility.PUBLIC;
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		toast.warning(`Delete "${title}"?`, {
			description: 'This action cannot be undone.',
			duration: 10000,
			action: {
				label: 'Delete',
				onClick: async () => {
					setIsDeleting(true);
					try {
						await deleteCodeFile(id);
						toast.success('File deleted successfully');
					} catch (error) {
						toast.error(error instanceof Error ? error.message : 'Failed to delete file');
						setIsDeleting(false);
					}
				},
			},
			cancel: {
				label: 'Cancel',
				onClick: () => {},
			},
		});
	};

	return (
		<Link
			href={`${AppRoutes.CODE}/${id}`}
			className={`group relative flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-neutral-700 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
		>
			<div className="flex items-center justify-between px-4 py-2.5 bg-neutral-800/60 border-b border-neutral-800">
				<div className="flex items-center gap-2">
					<div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
					<span className="font-mono text-xs font-medium text-primary-400 uppercase tracking-wider">
						{language}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<span
						className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide rounded-full ${
							isPublic
								? 'bg-success-500/15 text-success-400 ring-1 ring-success-500/30'
								: 'bg-neutral-700/50 text-neutral-400 ring-1 ring-neutral-600/50'
						}`}
					>
						<span
							className={`w-1.5 h-1.5 rounded-full ${isPublic ? 'bg-success-400' : 'bg-neutral-500'}`}
						/>
						{visibility}
					</span>
					<button
						onClick={handleDelete}
						disabled={isDeleting}
						className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
						aria-label="Delete file"
					>
						<TrashIcon className="w-4 h-4" />
					</button>
				</div>
			</div>

			<div className="flex flex-col flex-1 p-4 gap-3">
				<h3 className="font-semibold text-base text-neutral-100 truncate group-hover:text-primary-400 transition-colors">
					{title}
				</h3>

				<div className="mt-auto flex items-center gap-2 text-xs text-neutral-500">
					<svg
						className="w-3.5 h-3.5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>{new Date(updatedAt).toLocaleDateString()}</span>
				</div>
			</div>

			<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-linear-to-t from-primary-500/5 via-transparent to-transparent" />
		</Link>
	);
}
