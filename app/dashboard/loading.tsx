import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
	return (
		<div className="flex flex-col gap-6">
			{/* Header: Title + Create Button */}
			<div className="flex justify-between items-center">
				<Skeleton className="h-9 w-32" />
				<Skeleton className="h-10 w-28 rounded-lg" />
			</div>

			{/* Storage Quota Card */}
			<div className="relative overflow-hidden bg-linear-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-5 rounded-xl border border-neutral-700/50">
				<div className="flex items-center justify-between gap-4 mb-4">
					<div className="flex items-center gap-3">
						<Skeleton className="w-10 h-10 rounded-lg" />
						<div className="flex flex-col gap-1.5">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-5 w-28" />
						</div>
					</div>
					<Skeleton className="h-8 w-14" />
				</div>
				<Skeleton className="h-2.5 w-full rounded-full" />
			</div>

			{/* File Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div
						key={i}
						className="flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden"
					>
						{/* Card Header */}
						<div className="flex items-center justify-between px-4 py-2.5 bg-neutral-800/60 border-b border-neutral-800">
							<div className="flex items-center gap-2">
								<Skeleton className="w-2 h-2 rounded-full" />
								<Skeleton className="h-3 w-16" />
							</div>
							<Skeleton className="h-5 w-16 rounded-full" />
						</div>
						{/* Card Body */}
						<div className="flex flex-col flex-1 p-4 gap-3">
							<Skeleton className="h-5 w-3/4" />
							<div className="mt-auto flex items-center gap-2">
								<Skeleton className="w-3.5 h-3.5 rounded-full" />
								<Skeleton className="h-3 w-20" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
