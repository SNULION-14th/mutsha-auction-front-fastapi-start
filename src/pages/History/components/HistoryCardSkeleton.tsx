import { Skeleton } from "@/components/Skeleton";

export function HistoryCardSkeleton() {
  return (
    <div
      className={`w-full h-full flex flex-col rounded-xl shadow-lg px-15 py-7.5 gap-6 bg-bg-white`}
    >
      <Skeleton className="w-24 h-6" />
      <div className="w-full flex flex-col gap-2.5">
        <div className="w-full flex gap-12 justify-between">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="h-6 w-full" />
      </div>
      <Skeleton className="w-full h-12" />
    </div>
  );
}
