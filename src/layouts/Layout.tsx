import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { TransitionProvider } from "@/contexts/TransitionProvider";

// TODO(실습): 전역 '새 경매 등록' 알림을 SSE(EventSource)로 받도록 구현하세요.
//  - useEffect 안에서 new EventSource(`${VITE_API_BASE_URL}/sse/notifications`) 연결
//  - onmessage 에서 JSON.parse 후 alert(data.message)
//  - 언마운트 시 eventSource.close()

export default function Layout() {
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
