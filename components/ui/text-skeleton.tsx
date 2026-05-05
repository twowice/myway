import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface TextSkeletonProps {
  className?: string;
}

export function TextSkeleton({ className }: TextSkeletonProps) {
  return (
    <Skeleton
      aria-label="텍스트 로딩 중"
      className={cn("h-6 w-44 md:h-7 md:w-56", className)}
    />
  );
}
