import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { TransitionProvider } from "@/contexts/TransitionProvider";

export default function Layout() {
  // --- [전역 알림 SSE 연결] ---
  // Layout 은 모든 페이지의 공통 부모이므로, 여기서 SSE 를 구독하면
  // 어느 페이지에 있든 '새 경매 등록' 알림을 받을 수 있습니다.
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    // EventSource 는 표준 브라우저 API 로, SSE 스트림에 연결합니다.
    const eventSource = new EventSource(`${baseUrl}/sse/notifications`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.message) {
          alert(data.message);
        }
      } catch (e) {
        console.error("SSE 메시지 처리 오류:", e);
      }
    };

    eventSource.onerror = (e) => {
      console.error("SSE error:", e);
    };

    // 페이지를 떠날 때 연결 정리
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="w-full bg-bg-default">
      <Header />
      <TransitionProvider>
        <main className="min-h-screen pt-22">
          <ScrollToTop />
          <Outlet />
        </main>
      </TransitionProvider>
      <Footer />
    </div>
  );
}
