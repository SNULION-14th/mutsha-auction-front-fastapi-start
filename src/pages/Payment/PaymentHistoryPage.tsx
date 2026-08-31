import React, { useEffect, useState } from "react";
import { getPaymentHistory, PaymentHistoryItem } from "@/apis/api";
import { formatNumber } from "@/utils/number";
import { Cup } from "@/assets/image";
import { Skeleton } from "@/components/Skeleton";

const toNumber = (v: number | string | null | undefined) => {
  if (typeof v === "number") return v;
  if (v == null) return 0;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const PaymentHistoryPage: React.FC = () => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const history = await getPaymentHistory();
        setPaymentHistory(history);
      } catch (error) {
        console.error(
          "[DEBUG] PaymentHistoryPage - Failed to fetch payment history:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "CARD":
        return "카드";
      case "MONEY":
        return "현금";
      case "ACCOUNT":
        return "계좌이체";
      default:
        return method || "카카오페이";
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "DONE":
      case "SUCCESS":
      case "SUCCESS_PAYMENT":
        return {
          text: "결제 완료",
          cls: "bg-brand-secondary text-brand-primary",
        };
      case "CANCEL":
      case "CANCELED":
        return {
          text: "결제 취소",
          cls: "bg-scale-100 text-scale-500",
        };
      default:
        return {
          text: status || "진행 중",
          cls: "bg-scale-100 text-scale-500",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-default py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-scale-600 mb-2">
              결제 내역
            </h1>
            <p className="text-scale-400">
              카카오페이를 통한 모든 결제 내역을 확인할 수 있습니다.
            </p>
          </div>
          <Skeleton className="w-full h-112" />
          <Skeleton className="w-full h-34 mt-6" />
        </div>
      </div>
    );
  }

  const totalAmount = paymentHistory.reduce(
    (sum, p) => sum + toNumber(p.amount),
    0,
  );
  const totalCups = paymentHistory.reduce(
    (sum, p) => sum + toNumber(p.point),
    0,
  );

  return (
    <div className="min-h-screen bg-bg-default py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-scale-600 mb-2">결제 내역</h1>
          <p className="text-scale-400">
            카카오페이를 통한 모든 결제 내역을 확인할 수 있습니다.
          </p>
        </div>

        {paymentHistory.length === 0 ? (
          <div className="bg-bg-white rounded-xl shadow-sm border border-scale-200 p-10 text-center">
            <div className="text-scale-300 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-scale-600 mb-2">
              결제 내역이 없습니다
            </h3>
            <p className="text-scale-400">아직 결제한 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="bg-bg-white rounded-xl shadow-sm border border-scale-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-scale-200">
                <thead className="bg-scale-100/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-scale-400 tracking-wider">
                      상품명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-scale-400 tracking-wider">
                      결제 금액
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-scale-400 tracking-wider">
                      결제 수단
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-scale-400 tracking-wider">
                      결제 승인 시간
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-scale-400 tracking-wider">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-bg-white divide-y divide-scale-200">
                  {paymentHistory.map((payment, index) => {
                    const badge = getStatusBadge(payment.status);
                    return (
                      <tr
                        key={payment.tid}
                        className={
                          index % 2 === 0 ? "bg-white" : "bg-scale-100/30"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-brand-secondary flex items-center justify-center">
                              <img src={Cup} alt="cup" className="h-10 w-10" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-scale-600">
                                {payment.item_name}
                              </div>
                              <div className="text-sm text-scale-400">
                                {formatNumber(toNumber(payment.point))} 잔
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-scale-600">
                            {formatNumber(toNumber(payment.amount))}원
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-scale-100 text-scale-500">
                            {getPaymentMethodText(payment.payment_method_type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-scale-600">
                          {formatDate(payment.approved_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${badge.cls}`}
                          >
                            {badge.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {paymentHistory.length > 0 && (
          <div className="mt-6 bg-bg-white rounded-xl shadow-sm border border-scale-200 p-6">
            <h3 className="text-lg font-bold text-scale-600 mb-4">결제 요약</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-primary">
                  {paymentHistory.length}
                </div>
                <div className="text-sm text-scale-400">총 결제 건수</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-primary">
                  {formatNumber(toNumber(totalAmount))}원
                </div>
                <div className="text-sm text-scale-400">총 결제 금액</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-primary">
                  {formatNumber(toNumber(totalCups))}
                </div>
                <div className="text-sm text-scale-400">총 충전 잔</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
