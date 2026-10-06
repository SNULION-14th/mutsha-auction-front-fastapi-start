import { Cup } from "@/assets/image";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../Button";
import { numberCommaFormatter } from "@/utils/number";
import { paymentReady } from "@/apis/api";
import { useLocation } from "react-router-dom";

function PointCharge({ cup, money }: { cup: number; money: number }) {
  const location = useLocation();

  // FIXME: 로컬스토리지 deprecated
  const handlePayment = async () => {
    const token =
      localStorage.getItem("access_token") ||
      document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("access_token="))
        ?.split("=")[1];

    if (!token) {
      alert("로그인이 필요합니다. 먼저 로그인해주세요.");
      return;
    }

    try {
      const response = await paymentReady({
        point: cup.toString(),
        price: money.toString(),
      });
      if (response) {
        sessionStorage.setItem(
          "returnTo",
          location.pathname + location.search + location.hash,
        );
        sessionStorage.setItem("returnToScroll", String(window.scrollY));

        localStorage.setItem("tid", response.tid);
        window.location.href = response.next_redirect_pc_url;
      }
    } catch (error: any) {
      console.error("결제 준비 실패:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다. 먼저 로그인해주세요.");
      } else {
        alert("결제 준비에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src={Cup} className="w-10" />
        <div className="text-xl font-bold text-scale-500">{cup} 잔</div>
      </div>
      <Button
        variant="primary"
        isRounded={true}
        className="text-lg font-regular px-10 py-3"
        onClick={handlePayment}
      >
        ₩ {numberCommaFormatter(money)}
      </Button>
    </div>
  );
}

export default function PointChargeModal({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-133">
        <div className="flex flex-col items-center px-8 py-15 gap-12.5">
          <div className="text-2xl font-bold text-scale-600">
            포인트 충전하기
          </div>
          <div className="flex flex-col gap-9 w-full">
            <PointCharge cup={10} money={10000} />
            <PointCharge cup={30} money={30000} />
            <PointCharge cup={50} money={50000} />
            <PointCharge cup={100} money={90000} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
