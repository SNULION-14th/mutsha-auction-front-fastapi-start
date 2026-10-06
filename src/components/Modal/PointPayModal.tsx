import { getUserInfo, placeBid, UserProfile, AuctionDetail } from "@/apis/api";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { formatNumber } from "@/utils/number";
import { Button } from "../Button";
import InfoModal from "./InfoModal";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/router";
import PointChargeModal from "./PointChargeModal";
import { DialogPortal } from "@radix-ui/react-dialog";

export default function PointPayModal({
  bid,
  auctionId,
  onBidSuccess,
  children,
  isOpen,
  onOpenChange,
}: {
  bid: number;
  auctionId?: number;
  onBidSuccess: (newAuction: AuctionDetail) => void;
  children?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const [me, setMe] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDone, setShowDone] = useState(false);
  const [showCharge, setShowCharge] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const refetchMe = async () => {
    setLoading(true);
    try {
      const u = await getUserInfo();
      setMe(u);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await getUserInfo();
        if (mounted) setMe(u);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const myPoints = me?.remaining_points ?? 0;

  const canBid = useMemo(() => {
    if (loading) return false;
    if (!bid || bid <= 0) return false;
    return myPoints >= bid;
  }, [loading, bid, myPoints]);

  const isInsufficient = !loading && bid > 0 && myPoints < bid;

  const navigate = useNavigate();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogPortal />
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-[532px]">
          <div className="px-8 pt-20 pb-5 flex flex-col items-center gap-5">
            {!isInsufficient ? (
              <p className="text-scale-600 text-2xl font-bold text-center">
                <span className="font-bold text-brand-primary">
                  {formatNumber(bid)}
                </span>
                <span className="font-bold text-brand-primary"> 잔</span>으로 이
                상품에 <br />
                입찰할까요?
              </p>
            ) : (
              <p className="text-scale-600 text-2xl font-bold text-center">
                포인트가 부족합니다. <br /> 지금 바로 충전하시겠습니까?
              </p>
            )}
            <div>
              <span className="text-xl font-bold text-scale-500">
                내 포인트 :
                {loading ? "불러오는 중..." : ` ${formatNumber(myPoints)} 잔`}
              </span>
            </div>
            <div className="flex w-full items-center justify-center pt-5 gap-5">
              <Button
                variant="outlined"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                취소
              </Button>
              {!isInsufficient ? (
                <Button
                  variant="primary"
                  disabled={!canBid || submitting}
                  onClick={async () => {
                    if (!auctionId || submitting) return;
                    try {
                      setSubmitting(true);
                      // 현재는 HTTP 로 입찰합니다. 입찰자 본인에게만 최신 정보가 돌아옵니다.
                      const result = await placeBid(auctionId, bid);
                      if (result) {
                        onBidSuccess(result);
                        setShowDone(true);
                      }
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  className="flex-1"
                >
                  {submitting ? "처리 중 ..." : "입찰"}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setShowCharge(true)}
                  className="flex-1"
                >
                  충전하기
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <InfoModal
        open={showDone}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setShowDone(false);
            onOpenChange(false);
          }
        }}
        onClose={() => {
          setShowDone(false);
          onOpenChange(false);
        }}
        title={`입찰이 완료되었어요! \n내 경매에서 확인해 보세요.`}
        closeButton="닫기"
        confirmButton="내 경매 보기"
        onConfirm={() => {
          setShowDone(false);
          onOpenChange(false);
          navigate(ROUTES.HISTORY.ROOT);
        }}
      />

      <PointChargeModal
        open={showCharge}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setShowCharge(false);
            refetchMe();
          }
        }}
      />
    </>
  );
}
