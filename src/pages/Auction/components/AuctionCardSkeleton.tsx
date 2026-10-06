import { Skeleton } from "@/components/Skeleton";

export function AuctionCardSkeleton() {
  return (
    <div className="w-full h-109 flex flex-col bg-white shadow-lg rounded-xl">
      <Skeleton
        className="w-full h-68 object-cover rounded-t-xl"
        rounded="none"
      />
      <div className="w-full flex flex-col gap-1.5 px-6 py-5">
        <Skeleton className="w-30 h-6" />
        <Skeleton className="w-full h-6" />
      </div>
      <div className="w-full flex px-6 justify-between items-center">
        <div className="flex flex-col gap-1">
          <Skeleton className="w-30 h-6" />
          <Skeleton className="w-24 h-6" />
        </div>
        <Skeleton className="w-16 pc:w-28 h-9.5 p-2.5" />
      </div>
    </div>
  );
}
