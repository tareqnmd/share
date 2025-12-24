import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
	return (
		<div className="flex flex-col gap-4">
			{/* Top Row: Title + Controls */}
			<div className="grid grid-cols-[1fr_auto] items-center gap-4">
				{/* Title */}
				<Skeleton className="h-9 w-2/3 max-w-md" />

				{/* Controls */}
				<div className="flex items-center gap-2">
					<Skeleton className="h-9 w-28 rounded-lg" />
					<Skeleton className="h-9 w-24 rounded-lg" />
					<Skeleton className="h-9 w-28 rounded-lg" />
					<Skeleton className="h-9 w-9 rounded-lg" />
				</div>
			</div>

			{/* Code Editor Area */}
			<div className="relative">
				{/* Copy Button */}
				<div className="absolute top-3 right-3 z-10">
					<Skeleton className="h-8 w-8 rounded-md" />
				</div>
				{/* Editor */}
				<Skeleton className="h-[600px] w-full rounded-lg" />
			</div>

			{/* Bottom: Meta Info */}
			<div className="border-t border-neutral-800 pt-4">
				<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
					{/* Author & Date */}
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1.5">
							<Skeleton className="w-4 h-4 rounded-full" />
							<Skeleton className="h-4 w-24" />
						</div>
						<Skeleton className="w-1 h-1 rounded-full" />
						<div className="flex items-center gap-1.5">
							<Skeleton className="w-4 h-4 rounded" />
							<Skeleton className="h-4 w-20" />
						</div>
					</div>

					{/* Divider */}
					<Skeleton className="w-px h-4 hidden sm:block" />

					{/* Visibility Badge */}
					<Skeleton className="h-6 w-20 rounded-full" />

					{/* Save Status */}
					<Skeleton className="h-5 w-16" />
				</div>
			</div>
		</div>
	);
}
