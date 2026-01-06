import { Skeleton } from "@/components/ui/skeleton";

/* ===========================
    Event Card Skeleton
=========================== */
export function EventCardSkeleton({ isPanel }: { isPanel: boolean }) {
  return (
    <div className="rounded-xl overflow-hidden border bg-white">
      <Skeleton className={isPanel ? "h-[260px] w-full" : "h-[180px] w-full"} />

      <div className={isPanel ? "p-5 space-y-4" : "p-4 space-y-3"}>
        <Skeleton className={isPanel ? "h-5 w-4/5" : "h-4 w-3/4"} />
        <Skeleton className={isPanel ? "h-4 w-3/5" : "h-3 w-1/2"} />
        <Skeleton className={isPanel ? "h-4 w-2/3" : "h-3 w-2/3"} />
      </div>
    </div>
  );
}

/* ===========================
    Skeleton Grid
=========================== */
interface EventSkeletonGridProps {
  count?: number;
  isPanel?: boolean;
}

export function EventSkeletonGrid({
  count,
  isPanel = false,
}: EventSkeletonGridProps) {
  const finalCount = isPanel ? 1 : count ?? 8;

  return (
    <div
      className={
        isPanel
          ? "grid grid-cols-1 gap-y-[16px]"
          : `
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-x-[16px]
            gap-y-[16px]
          `
      }
    >
      {Array.from({ length: finalCount }).map((_, idx) => (
        <EventCardSkeleton key={idx} isPanel={isPanel} />
      ))}
    </div>
  );
}
