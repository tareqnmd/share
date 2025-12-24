import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card flex flex-col gap-3">
             <div className="flex justify-between items-start gap-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-16 rounded-full shrink-0" />
             </div>
             <Skeleton className="h-4 w-1/4" />
             <Skeleton className="h-3 w-1/3 mt-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
