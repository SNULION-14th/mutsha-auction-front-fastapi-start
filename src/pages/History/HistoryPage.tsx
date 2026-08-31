import { getRemainingTime } from "@/utils/datetime";
import { HistoryCard } from "./components/HistoryCard";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getMyAuctions,
  getMyBids,
  MyAuctionHistory,
  MyBidHistory,
} from "@/apis/api";
import { ROUTES } from "@/constants/router";
import { useTransition } from "@/contexts/TransitionProvider";
import { HistoryCardSkeleton } from "./components/HistoryCardSkeleton";

const PAGE_SIZE = 6;
type Tab = "bids" | "mine";

function isEnded(end_time: string) {
  return getRemainingTime(end_time) === "00d 00h 00m";
}

function scenarioFromBid(
  b: MyBidHistory,
): "not-highest" | "highest" | "win" | "lose" {
  const ended = b.status === "ended";
  if (ended) return b.is_winner ? "win" : "lose";
  return b.my_bid >= b.current_price ? "highest" : "not-highest";
}

function HistoryPage() {
  const [tab, setTab] = useState<Tab>("bids");

  const [myBids, setMyBids] = useState<MyBidHistory[]>([]);
  const [myAuctions, setMyAuctions] = useState<MyAuctionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const [visibleBids, setVisibleBids] = useState(PAGE_SIZE);
  const [visibleMine, setVisibleMine] = useState(PAGE_SIZE);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { playTransition } = useTransition();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [bids, mine] = await Promise.all([getMyBids(), getMyAuctions()]);
      setMyBids(bids);
      setMyAuctions(mine);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [tab]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (tab === "bids") {
          setVisibleBids((v) => Math.min(v + PAGE_SIZE, myBids.length));
        } else {
          setVisibleMine((v) => Math.min(v + PAGE_SIZE, myAuctions.length));
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [tab, myBids.length, myAuctions.length]);

  const listBids = useMemo(
    () => myBids.slice(0, visibleBids),
    [myBids, visibleBids],
  );

  const listMine = useMemo(
    () => myAuctions.slice(0, visibleMine),
    [myAuctions, visibleMine],
  );

  return (
    <div className="w-full px-30 pc:px-50 py-30">
      <div className="max-w-[1062px] flex flex-col mx-auto gap-16">
        <div className="flex flex-col gap-5">
          <div className="text-3xl pc:text-5xl font-bold text-scale-600">
            내 경매
          </div>
          <div className="text-lg pc:text-2xl text-scale-400">
            나의 입찰과 등록 현황을 한눈에 확인하세요.
          </div>
        </div>
        <div className="flex border-b-2 border-scale-200 relative">
          <button
            className={`w-20 pc:w-30 text-lg pc:text-2xl font-bold pb-2 pc:pb-6 relative ${
              tab === "bids" ? "text-brand-primary" : "text-scale-300"
            }`}
            onClick={() => setTab("bids")}
          >
            입찰 중
            {tab === "bids" && (
              <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-brand-primary" />
            )}
          </button>
          <button
            className={`w-20 pc:w-30 text-lg pc:text-2xl font-bold pb-2 pc:pb-6 relative ${
              tab === "mine" ? "text-brand-primary" : "text-scale-300"
            }`}
            onClick={() => setTab("mine")}
          >
            내 등록
            {tab === "mine" && (
              <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-brand-primary" />
            )}
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 pc:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <HistoryCardSkeleton key={i} />
            ))}
          </div>
        ) : (tab === "bids" ? listBids.length === 0 : listMine.length === 0) ? (
          <div className="text-center text-scale-400 py-20">
            {tab === "bids"
              ? "입찰한 경매가 없습니다."
              : "등록한 경매가 없습니다."}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 pc:grid-cols-2 gap-6">
              {tab === "bids"
                ? listBids.map((b) => {
                    const ended = isEnded(b.end_time) || b.status === "ended";
                    const duration = ended
                      ? "00d 00h 00m"
                      : getRemainingTime(b.end_time);
                    const resultText = ended
                      ? b.is_winner
                        ? "낙찰 성공"
                        : "낙찰 실패"
                      : undefined;

                    const toRoom = ROUTES.AUCTION.ROOM.replace(
                      ":auctionId",
                      String(b.auction_id),
                    );

                    return (
                      <HistoryCard
                        key={b.auction_id}
                        id={b.auction_id}
                        title={b.title}
                        current_price={b.current_price}
                        my_bid={b.my_bid}
                        duration={duration}
                        ended={ended}
                        rightLabel="내 입찰가"
                        resultText={resultText}
                        win={b.is_winner}
                        buttonText="입찰하기"
                        onClick={() =>
                          playTransition({
                            scenario: scenarioFromBid(b),
                            to: toRoom,
                          })
                        }
                      />
                    );
                  })
                : listMine.map((m) => {
                    const ended =
                      isEnded(m.end_time) ||
                      m.status === "ended" ||
                      m.status === "cancelled";
                    const duration = ended
                      ? "00d 00h 00m"
                      : getRemainingTime(m.end_time);

                    return (
                      <HistoryCard
                        key={m.auction_id}
                        id={m.auction_id}
                        title={m.title}
                        current_price={m.current_price}
                        my_bid={m.start_price}
                        duration={duration}
                        ended={ended}
                        rightLabel="최소 입찰가"
                        buttonText="경매 보러가기"
                      />
                    );
                  })}
            </div>
            <div ref={sentinelRef} className="h-8" />
          </>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
