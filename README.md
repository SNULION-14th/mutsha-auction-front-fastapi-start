# Auction Frontend (React) — 실습 시작점

세미나 **sem6 실습의 출발점(프론트엔드)** 입니다. 경매 앱은 잘 동작하지만,
아직 **실시간 연동(WebSocket / SSE)이 비어 있는 "문제 상태"** 예요.

> 지금은 입찰을 해도 **내 화면만** 갱신되고, 같은 경매방의 다른 사람 화면은 그대로입니다.
> 가이드를 따라 `AuctionRoomPage.tsx`(WebSocket)와 `Layout.tsx`(SSE)에 실시간 연동을 추가하세요.

`AuctionRoomPage.tsx`, `Layout.tsx` 안에 `TODO(실습)` 주석으로 구현할 지점을 표시해 두었습니다.

## 🚀 실행

```bash
npm install
npm run dev
```

- `.env` 의 `VITE_API_BASE_URL` 이 백엔드 주소(기본 `http://localhost:8000`)를 가리킵니다.
- 백엔드(`mutsha-auction-back-fastapi-start`)를 함께 실행해야 로그인·경매 조회가 동작합니다.

## ✅ 오늘 구현할 것 (가이드 참고)

1. **WebSocket** — 경매방(`/ws/auction/{id}`)에서 실시간으로 입찰가를 주고받기 (양방향)
2. **SSE** — 새 경매가 등록되면(`/sse/notifications`) 사이트 전체에 알림 받기 (단방향)

정답 구현은 **`mutsha-auction-front-fastapi`** 저장소의 `main` 브랜치에서 확인할 수 있습니다.
