import { AppRoutes, FileVisibility } from '@/types/enums';
import Link from 'next/link';

interface FileCardProps {
	id: string;
	title: string;
	language: string;
	visibility: string;
	updatedAt: string;
}

export default function FileCard({ id, title, language, visibility, updatedAt }: FileCardProps) {
	return (
		<Link href={`${AppRoutes.CODE}/${id}`} className="card flex flex-col gap-3 transition-shadow">
			<div className="flex justify-between items-start gap-2">
				<h3 className="font-bold text-lg truncate text-neutral-50">{title}</h3>
				<span
					className={`badge shrink-0 ${
						visibility === FileVisibility.PUBLIC ? 'badge-success' : 'badge-neutral'
					}`}
				>
					{visibility}
				</span>
			</div>
			<p className="text-sm text-neutral-400">{language}</p>
			<div className="text-xs text-neutral-500 mt-auto">
				Updated {new Date(updatedAt).toLocaleDateString()}
			</div>
		</Link>
	);
}
