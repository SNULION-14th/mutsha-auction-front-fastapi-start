import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";

export default function PaymentFailPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-default">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">❌</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-scale-600 mb-2">
            결제에 실패하였습니다
          </h1>
          <p className="text-scale-500">
            결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="gray" size="large" onClick={() => navigate("/")}>
            메인으로 돌아가기
          </Button>
          <Button
            variant="primary"
            size="large"
            onClick={() => window.history.back()}
          >
            다시 시도하기
          </Button>
        </div>
      </div>
    </div>
  );
}
