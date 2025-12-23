import { Skeleton } from "@/components/ui/skeleton";


/* ===========================
    Event Card Skeleton
=========================== */
function EventCardSkeleton() {
    return (
        <div className="rounded-xl overflow-hidden border bg-white">
            <Skeleton className="h-[180px] w-full" />

            <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
            </div>
        </div>
    );
}


/* ===========================
    Skeleton Grid
=========================== */
interface EventSkeletonGridProps {
    count?: number;
}


export function EventSkeletonGrid({ count = 8 }: EventSkeletonGridProps) {
    return (
        <div
            className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-x-[16px]
                gap-y-[16px]
            "
        >
            {Array.from({ length: count }).map((_, idx) => (
                <EventCardSkeleton key={idx} />
            ))}
        </div>
    );
}