import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAuction, CreateAuctionRequest } from "@/apis/api";

export function useCreateAuction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAuctionRequest) => createAuction(data),
    onSuccess: () => {
      // 성공 시 경매 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      queryClient.invalidateQueries({ queryKey: ["myAuctions"] });
      queryClient.invalidateQueries({ queryKey: ["recommendedAuctions"] });
    },
    onError: (error) => {
      console.error("경매 생성 실패:", error);
    },
  });
}
