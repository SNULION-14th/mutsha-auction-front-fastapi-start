import { Skeleton } from "@/components/Skeleton";

export function AuctionRoomSkeleton() {
  return (
    <div className="w-full px-30 pc:px-50 py-30">
      <div className="max-w-[1062px] mx-auto flex flex-col gap-12 pc:gap-25">
        <div className="flex flex-col gap-5">
          <div className="text-3xl pc:text-5xl font-bold text-scale-600">
            경매 입찰하기
          </div>
          <div className="text-lg pc:text-2xl text-scale-400">
            멋사 구성원들의 애착템에 입찰해보세요!
          </div>
        </div>
        <div className="w-full h-full flex max-pc:flex-col gap-9">
          <div className="w-full pc:w-[470px] pc:min-h-[577px] rounded-2xl bg-bg-white flex flex-col gap-2 pc:gap-5 shadow-xl">
            <Skeleton
              className="w-full h-[240px] shirnk-0 pc:h-90 rounded-t-2xl"
              rounded="none"
            />
            <div className="p-6 pc:px-7 pc:py-5 pc:pb-12 flex flex-col gap-6">
              <Skeleton className="h-6 pc:h-7 w-40" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          <div className="w-full pc:min-h-[577px] rounded-2xl bg-bg-white flex flex-col gap-14 shadow-xl px-6 py-12 pc:px-12.5 pc:py-20 justify-center">
            <div className="flex flex-col gap-6">
              <Skeleton className="h-7 pc:h-9 w-40" />
              <Skeleton className="w-full h-6 pc:h-10" />
              <Skeleton className="w-full h-6 pc:h-10" />
              <div className="flex items-center w-full py-2.5 gap-12">
                <Skeleton className="h-6 pc:h-12 w-1/2" />
                <Skeleton className="h-6 pc:h-12 w-1/2" />
              </div>
            </div>
            <div className="flex flex-col gap-7">
              <Skeleton className="h-9 w-40" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
