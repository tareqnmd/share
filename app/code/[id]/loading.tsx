import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
	return (
		<div className="space-y-4">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
				<div className="flex-1 w-full space-y-2">
					<Skeleton className="h-8 w-1/3" />
					<Skeleton className="h-4 w-1/4" />
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-9 w-24" />
					<Skeleton className="h-9 w-24" />
					<Skeleton className="h-9 w-24" />
					<Skeleton className="h-9 w-16" />
				</div>
			</div>
			<Skeleton className="h-[600px] w-full rounded-md" />
		</div>
	);
}
