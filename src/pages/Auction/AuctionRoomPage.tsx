import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuctionDetail, getAuctionDetail } from "@/apis/api";
import { Button } from "@/components/Button";
import { Cup, LogoWhite } from "@/assets/image";
import { getRemainingTime } from "@/utils/datetime";
import PointPayModal from "@/components/Modal/PointPayModal";
import { AuctionRoomSkeleton } from "./components/AuctionRoomSkeleton";

// TODO(실습): 경매방 실시간 입찰을 WebSocket 으로 구현하세요.
//  현재는 입찰(HTTP POST)을 해도 '나에게만' 최신 정보가 반영됩니다.
//  같은 경매방을 보고 있는 다른 사용자에게는 실시간으로 전달되지 않아요!
//  1) useEffect 로 ws://.../ws/auction/{id} 에 연결
//  2) ws.onmessage 에서 받은 최신 경매 정보로 setAuction
//  3) (심화) 입찰을 HTTP 가 아니라 ws.send({type:"bid", amount}) 로 보내기

function AuctionRoomPage() {
  const { auctionId } = useParams<{ auctionId: string }>();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<AuctionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bidInput, setBidInput] = useState<string>("");
  const [isPayOpen, setIsPayOpen] = useState(false);
  const bid = useMemo(() => {
    const n = Number(bidInput.replace(/[^\d]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [bidInput]);

  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    async function fetchAuctionDetail() {
      try {
        setLoading(true);
        const data = await getAuctionDetail(auctionId ?? "");
        if (data) {
          setAuction(data);
          setRemainingTime(getRemainingTime(data.end_time));
        } else {
          setError("경매를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("경매 상세 정보 로딩 실패:", err);
        setError("경매 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    if (auctionId) {
      fetchAuctionDetail();
    }
  }, [auctionId]);

  useEffect(() => {
    if (!auction) return;

    const interval = setInterval(() => {
      setRemainingTime(getRemainingTime(auction.end_time));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [auction]);

  const isValidBid = useMemo(() => {
    if (!auction) return false;
    const min = Math.max(
      auction.starting_price ?? 0,
      (auction.current_price ?? 0) + 1,
    );
    return bid >= min;
  }, [auction, bid]);

  // HTTP 입찰 성공 시, 응답으로 받은 최신 경매 정보로 '내 화면'만 갱신
  const handleBidSuccess = (newAuction: AuctionDetail) => {
    setAuction(newAuction);
    setBidInput("");
  };

  const isEnded = useMemo(() => {
    if (!auction?.end_time) return false;
    return getRemainingTime(auction.end_time) === "00d 00h 00m";
  }, [auction?.end_time]);

  if (loading) {
    return <AuctionRoomSkeleton />;
  }

  if (error || !auction) {
    return (
      <div className="w-full px-50 pt-40">
        <div className="max-w-[1160px] mx-auto text-center">
          <div className="text-2xl text-scale-500 mb-4">{error}</div>
          <Button variant="primary" onClick={() => navigate("/auction")}>
            경매 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

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
          <div className="w-full shrink-0 pc:w-90 pc:min-h-[577px] rounded-2xl bg-bg-white flex flex-col gap-2 pc:gap-5 shadow-xl">
            <img
              src={String(auction.image_file)}
              className="w-full h-[240px] pc:h-[392px] object-cover rounded-t-2xl"
            />
            <div className="p-6 pc:px-7 pc:py-5 pc:pb-12 flex flex-col gap-6">
              <div className="text-lg pc:text-2xl font-bold text-scale-600">
                {auction.title}
              </div>
              <div className="text-base pc:text-lg text-scale-400">
                {auction.description}
              </div>
            </div>
          </div>
          <div className="w-full shrink-1 pc:min-h-[577px] rounded-2xl bg-bg-white flex flex-col gap-14 shadow-xl px-6 py-12 pc:px-12.5 pc:py-20 justify-center">
            <div className="flex flex-col gap-4">
              <div className="text-2xl pc:text-3xl font-bold text-scale-600">
                경매 정보
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg pc:text-xl font-bold text-scale-500">
                  현재 입찰가
                </div>
                <div className="flex items-center gap-3">
                  <img src={Cup} className="w-6 pc:w-10" />
                  <div className="text-2xl pc:text-3xl font-bold text-brand-primary">
                    {auction.current_price}잔
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg pc:text-xl font-bold text-scale-500">
                  남은 시간
                </div>
                <div className="text-lg pc:text-2xl font-bold text-scale-500">
                  {getRemainingTime(auction.end_time)}
                </div>
              </div>
              <div className="flex items-center w-full py-2.5">
                <div className="w-1/2 flex flex-col gap-1.5">
                  <div className="text-lg pc:text-xl font-bold text-scale-500">
                    최소 입찰가
                  </div>
                  <div className="text-lg pc:text-xl text-scale-400">
                    {auction.starting_price}
                  </div>
                </div>
                <div className="w-1/2 flex flex-col gap-1.5">
                  <div className="text-lg pc:text-xl font-bold text-scale-500">
                    판매자
                  </div>
                  <div className="text-lg pc:text-xl text-scale-400">
                    {auction.seller_nickname}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-7">
              <div className="text-2xl pc:text-3xl font-bold text-scale-600">
                입찰하기
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    inputMode="numeric"
                    disabled={isEnded}
                    min={Math.max(
                      auction.starting_price ?? 0,
                      (auction.current_price ?? 0) + 1,
                    )}
                    value={bidInput}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^\d]/g, "");
                      setBidInput(v.replace(/^0+(?=\d)/, ""));
                    }}
                    placeholder={isEnded ? "이미 종료된 경매" : "입찰가 입력"}
                    className={`w-full h-12 rounded-sm border border-scale-200 px-4 placeholder:text-scale-300 focus:outline-none ${
                      isEnded
                        ? "bg-scale-100 text-scale-300 cursor-not-allowed"
                        : "text-scale-600 focus:ring-2 focus:ring-brand-primary/40"
                    }`}
                  />
                  <span className="text-xl text-scale-600">잔</span>
                  {isEnded ? (
                    <Button
                      variant="darkgray"
                      className="h-12 w-50 px-6 flex gap-2.5 items-center justify-center cursor-not-allowed"
                    >
                      경매 종료
                    </Button>
                  ) : (
                    <PointPayModal
                      bid={bid}
                      auctionId={auction.id}
                      onBidSuccess={handleBidSuccess}
                      isOpen={isPayOpen}
                      onOpenChange={setIsPayOpen}
                    >
                      <Button
                        variant="primary"
                        disabled={!isValidBid}
                        onClick={() => setIsPayOpen(true)}
                        className="h-12 w-24 pc:w-50 px-6 flex gap-2.5 items-center justify-center"
                      >
                        <img src={LogoWhite} className="w-5" />
                        <div className="max-pc:hidden">입찰하기</div>
                      </Button>
                    </PointPayModal>
                  )}
                </div>
                {!isEnded && !isValidBid && (
                  <div className="text-base px-2 text-point-warning">
                    최소{" "}
                    {Math.max(
                      auction.starting_price ?? 0,
                      (auction.current_price ?? 0) + 1,
                    )}
                    잔 이상으로 입력해 주세요.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionRoomPage;
