# 멋샤 경매 프론트엔드 아키텍처 문서

## 📋 프로젝트 개요

**프로젝트명**: Mutsha Auction Frontend (mutsha-auction-front-professor)
**버전**: 0.0.0
**유형**: 실시간 경매 시스템 프론트엔드
**기술 스택**: React 19 + TypeScript + Vite + TailwindCSS

---

## 🏗️ 시스템 아키텍처

### 1. 전체 구조 개요

```
┌─────────────────────────────────────────────────────────────┐
│                    사용자 인터페이스                          │
├─────────────────────────────────────────────────────────────┤
│  Pages Layer (페이지 컴포넌트)                                │
│  - 홈 / 경매 검색 / 경매룸 / 히스토리 / 결제                   │
├─────────────────────────────────────────────────────────────┤
│  Components Layer (재사용 컴포넌트)                           │
│  - UI 컴포넌트 / 모달 / 레이아웃                               │
├─────────────────────────────────────────────────────────────┤
│  State Management (상태 관리)                                 │
│  - React Query / Context API                                │
├─────────────────────────────────────────────────────────────┤
│  Business Logic (비즈니스 로직)                               │
│  - API Layer / Custom Hooks                                 │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure (인프라)                                      │
│  - Axios / Socket.io / i18next                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 디렉토리 구조

```
src/
├── apis/                    # API 계층
│   ├── api.ts              # API 함수 정의
│   └── axios.ts            # Axios 인스턴스 & 인터셉터
├── assets/                  # 정적 리소스 (이미지, 폰트 등)
├── components/              # 재사용 가능한 컴포넌트
│   ├── ui/                 # shadcn/ui 기반 UI 컴포넌트
│   │   ├── dialog.tsx
│   │   └── dropdown-menu.tsx
│   ├── Modal/              # 모달 컴포넌트들
│   │   ├── LoginModal.tsx
│   │   ├── ProfileModal.tsx
│   │   ├── PointChargeModal.tsx
│   │   └── ...
│   ├── Button.tsx
│   ├── Pagination.tsx
│   ├── Skeleton.tsx
│   └── ...
├── constants/               # 상수 정의
│   └── router.ts           # 라우팅 경로 상수
├── contexts/                # Context API 프로바이더
│   ├── TransitionProvider.tsx
│   └── UserInfoProvider.tsx
├── hooks/                   # 커스텀 훅
│   ├── useModal.tsx
│   ├── useAuthQuery.ts
│   └── useOnClickOutside.ts
├── i18n.ts                  # 국제화 설정
├── layouts/                 # 레이아웃 컴포넌트
│   ├── Layout.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/                     # 유틸리티 라이브러리
│   └── utils.ts            # shadcn/ui 유틸
├── locales/                 # 다국어 번역 파일
│   ├── ko.json
│   ├── en.json
│   └── ja.json
├── pages/                   # 페이지 컴포넌트
│   ├── HomePage/
│   │   ├── HomePage.tsx
│   │   └── components/
│   ├── Auction/
│   │   ├── AuctionSearchPage.tsx
│   │   ├── AuctionRoomPage.tsx
│   │   └── components/
│   ├── History/
│   │   ├── HistoryPage.tsx
│   │   └── components/
│   ├── Payment/
│   │   ├── PaymentApprovalPage.tsx
│   │   ├── PaymentCancelPage.tsx
│   │   ├── PaymentFailPage.tsx
│   │   └── PaymentHistoryPage.tsx
│   ├── AuctionCreatePage.tsx
│   ├── Auth.tsx
│   └── NotFoundPage.tsx
├── utils/                   # 유틸리티 함수
│   ├── datetime.ts
│   ├── number.ts
│   ├── url.ts
│   └── cn.ts
├── App.tsx                  # 앱 루트 컴포넌트
├── Router.tsx               # 라우팅 설정
└── main.tsx                 # 진입점
```

---

## 🔧 핵심 기술 스택

### 프레임워크 & 라이브러리

| 카테고리            | 기술             | 버전            | 용도                   |
| ------------------- | ---------------- | --------------- | ---------------------- |
| **UI 프레임워크**   | React            | 19.1.1          | UI 렌더링              |
| **언어**            | TypeScript       | 5.9.2           | 타입 안정성            |
| **빌드 도구**       | Vite             | 7.1.2           | 개발 서버 & 빌드       |
| **스타일링**        | TailwindCSS      | 4.1.13          | 유틸리티 CSS           |
| **라우팅**          | React Router DOM | 7.9.1           | 클라이언트 라우팅      |
| **상태 관리**       | TanStack Query   | 5.90.5          | 서버 상태 관리         |
| **HTTP 클라이언트** | Axios            | 1.12.2          | API 통신               |
| **실시간 통신**     | Socket.io Client | 4.8.1           | 실시간 경매 입찰       |
| **국제화**          | i18next          | 25.5.2          | 다국어 지원 (한/영/일) |
| **3D 렌더링**       | Three.js + R3F   | 0.180.0 / 9.4.0 | 3D 모델 렌더링         |
| **애니메이션**      | Lottie React     | 2.4.1           | 애니메이션 효과        |
| **UI 컴포넌트**     | Radix UI         | -               | 접근성 기반 UI         |

---

## 🎯 주요 기능 모듈

### 1. 인증 & 사용자 관리

- **소셜 로그인**: 카카오 OAuth 통합
- **토큰 관리**: 쿠키 기반 Access/Refresh Token
- **자동 갱신**: Axios 인터셉터를 통한 토큰 자동 갱신
- **프로필 관리**: 닉네임, 프로필 이미지 변경

### 2. 경매 시스템

- **경매 목록**: 상태별 필터링 (active/ended/cancelled)
- **실시간 입찰**: Socket.io를 통한 실시간 입찰
- **경매 생성**: 이미지 업로드 포함 경매 등록
- **추천 경매**: 개인화된 경매 추천

### 3. 결제 시스템

- **포인트 충전**: 카카오페이 연동
- **결제 플로우**: 결제 준비 → 승인 → 완료
- **결제 내역**: 충전 및 사용 내역 조회

### 4. 히스토리 추적

- **내 경매**: 등록한 경매 내역
- **입찰 내역**: 참여한 경매 및 낙찰 여부

### 5. 국제화 (i18n)

- **지원 언어**: 한국어(기본), 영어, 일본어
- **자동 감지**: 브라우저 언어 자동 감지
- **동적 전환**: 언어 스위처를 통한 실시간 전환

---

## 🔄 데이터 플로우

### 1. API 통신 플로우

```
사용자 액션
    ↓
React Query Hook (useQuery/useMutation)
    ↓
API 함수 (apis/api.ts)
    ↓
Axios 인스턴스 (apis/axios.ts)
    ↓ [Request Interceptor]
    ├─ 쿠키 기반 인증 (withCredentials: true)
    └─ 헤더 설정
    ↓
백엔드 API
    ↓
    ↓ [Response Interceptor]
    ├─ 401 에러 → 토큰 갱신 시도
    └─ 성공 → 원본 요청 재시도
    ↓
React Query 캐시 업데이트
    ↓
UI 자동 리렌더링
```

### 2. 실시간 경매 플로우

```
사용자 입찰
    ↓
placeBid API 호출
    ↓
백엔드 검증 & DB 저장
    ↓
Socket.io 브로드캐스트
    ↓
모든 클라이언트 수신
    ↓
UI 실시간 업데이트
```

---

## 🛡️ 보안 아키텍처

### 인증 메커니즘

1. **쿠키 기반 인증**: HttpOnly 쿠키를 통한 토큰 저장
2. **자동 토큰 갱신**: 401 에러 발생 시 자동으로 `/user/refresh/` 호출
3. **토큰 만료 처리**: Refresh Token도 만료 시 로그인 페이지로 리다이렉트

```typescript
// axios.ts 인터셉터 로직
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    if (err.response?.status === 401 && !isRefreshEndpoint) {
      try {
        await api.post("/user/refresh/", {});
        return api.request(originalRequest);
      } catch (refreshError) {
        // Refresh 실패 → 로그인 필요
        throw new RefreshTokenExpiredError("Refresh token expired");
      }
    }
    return Promise.reject(err);
  },
);
```

---

## 🎨 UI/UX 아키텍처

### 디자인 시스템

- **Base**: shadcn/ui (Radix UI 기반)
- **스타일**: TailwindCSS v4 + CSS Variables
- **테마**: New York 스타일
- **아이콘**: Lucide React

### 컴포넌트 계층 구조

```
Layout (공통 레이아웃)
  ├── Header (헤더 + 네비게이션)
  ├── TransitionOverlay (페이지 전환 효과)
  └── Content Area
      ├── Page Components (페이지별 컴포넌트)
      │   ├── HomePage
      │   ├── AuctionSearchPage
      │   ├── AuctionRoomPage
      │   └── ...
      └── Modal System (모달 레이어)
          ├── LoginModal
          ├── ProfileModal
          └── ...
```

### 반응형 디자인

- **모바일 우선**: TailwindCSS의 모바일 우선 접근법
- **브레이크포인트**: sm, md, lg, xl, 2xl 활용

---

## 📊 상태 관리 전략

### 1. 서버 상태 (TanStack Query)

- **캐싱 전략**: 5분 기본 staleTime
- **자동 갱신**: 윈도우 포커스 시 재검증 비활성화
- **재시도**: 1회 자동 재시도

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### 2. 클라이언트 상태 (Context API)

- **UserInfoProvider**: 사용자 정보 전역 상태
- **TransitionProvider**: 페이지 전환 애니메이션 상태
- **ModalProvider**: 모달 열기/닫기 상태

---

## 🌐 라우팅 아키텍처

### 라우트 구조

| 경로                  | 페이지              | 설명             |
| --------------------- | ------------------- | ---------------- |
| `/`                   | HomePage            | 메인 페이지      |
| `/auction`            | AuctionSearchPage   | 경매 검색        |
| `/auction/:auctionId` | AuctionRoomPage     | 경매 상세/입찰   |
| `/create`             | AuctionCreatePage   | 경매 등록        |
| `/history`            | HistoryPage         | 경매 히스토리    |
| `/auth`               | AuthPage            | 소셜 로그인 콜백 |
| `/payment/approve`    | PaymentApprovalPage | 결제 승인        |
| `/payment/cancel`     | PaymentCancelPage   | 결제 취소        |
| `/payment/fail`       | PaymentFailPage     | 결제 실패        |
| `/payment/history`    | PaymentHistoryPage  | 결제 내역        |
| `*`                   | NotFoundPage        | 404 페이지       |

### 코드 스플리팅

- **Lazy Loading**: 모든 페이지 컴포넌트를 React.lazy()로 지연 로딩
- **Suspense**: 로딩 상태 처리

```typescript
const HomePage = lazy(() => import("@page/HomePage/HomePage"));
const AuctionSearchPage = lazy(() => import("@page/Auction/AuctionSearchPage"));
// ... 모든 페이지 lazy 로딩
```

---

## 🔌 API 설계

### 엔드포인트 구조

#### 인증

- `GET /api/user/kakao/callback/` - 카카오 로그인 콜백
- `GET /api/user/me/` - 현재 사용자 정보 조회
- `PUT /api/user/me/` - 사용자 프로필 수정
- `POST /api/user/refresh/` - Access Token 갱신

#### 경매

- `GET /api/auction/` - 경매 목록 (필터: status, search)
- `GET /api/auction/recommended/` - 추천 경매
- `GET /api/auction/:id/` - 경매 상세 정보
- `POST /api/auction/create/` - 경매 생성 (FormData 지원)
- `POST /api/auction/:id/bid/` - 입찰
- `GET /api/auction/my-auctions/` - 내 경매 목록
- `GET /api/auction/my-bids/` - 내 입찰 내역

#### 결제

- `POST /api/payment/ready/` - 결제 준비 (카카오페이)
- `POST /api/payment/approve/` - 결제 승인
- `GET /api/payment/history/` - 결제 내역

### 타입 정의

모든 API 응답은 TypeScript 인터페이스로 타입 정의:

```typescript
export type AuctionDetail = {
  id: number;
  title: string;
  description: string;
  starting_price: number;
  current_price: number;
  status: "active" | "ended" | "cancelled";
  // ...
};
```

---

## 🚀 성능 최적화 전략

### 1. 번들 최적화

- **Vite**: 빠른 HMR & 최적화된 프로덕션 빌드
- **Tree Shaking**: ES 모듈 기반 자동 트리 쉐이킹
- **Lazy Loading**: 페이지 단위 코드 스플리팅

### 2. 렌더링 최적화

- **React 19**: 최신 React 기능 활용 (Concurrent Features)
- **Skeleton UI**: 로딩 상태 시각화로 UX 개선
- **React Query**: 자동 캐싱 & 중복 요청 방지

### 3. 리소스 최적화

- **이미지**: Lazy loading 적용
- **폰트**: 로컬 폰트 사용
- **CSS**: TailwindCSS JIT 컴파일러

---

## 🧪 개발 환경

### 빌드 & 개발 도구

- **ESLint**: 코드 품질 검사 (React 19 규칙 포함)
- **Prettier**: 코드 포맷팅
- **Husky**: Git Hooks (commit/push 시 자동 검사)
- **TypeScript**: Strict 모드 활성화

### 환경 변수

```
VITE_API_BASE_URL - 백엔드 API 베이스 URL
```

### NPM Scripts

```json
{
  "dev": "vite", // 개발 서버 실행
  "build": "vite build", // 프로덕션 빌드
  "lint": "eslint --cache .", // 린트 검사
  "preview": "vite preview", // 빌드 미리보기
  "format": "prettier --cache --write ." // 포맷팅
}
```

---

## 🔮 특수 기능

### 1. 3D 렌더링 (Three.js)

- **LionModel.tsx**: 3D 사자 모델 렌더링
- **@react-three/fiber**: React 통합 Three.js
- **@react-three/drei**: 헬퍼 컴포넌트

### 2. Lottie 애니메이션

- **lottie-react**: JSON 기반 애니메이션
- 로딩, 전환 효과 등에 활용

### 3. 페이지 전환 애니메이션

- **TransitionProvider**: 부드러운 페이지 전환
- **TransitionOverlay**: 전환 중 오버레이 표시

---

## 📈 확장성 고려사항

### 1. 모듈화 구조

- **도메인별 분리**: 페이지, API, 컴포넌트 독립적 구성
- **재사용성**: 공통 컴포넌트 분리 (components/ui)

### 2. 타입 안정성

- **strict TypeScript**: 모든 API 응답 타입 정의
- **noUncheckedIndexedAccess**: 배열 접근 안정성

### 3. 국제화 준비

- **i18next**: 확장 가능한 번역 시스템
- **언어별 JSON**: 언어 추가 용이

### 4. 테스트 용이성

- **컴포넌트 독립성**: Props 기반 컴포넌트
- **Custom Hooks**: 로직 분리

---

## 🐛 에러 처리 전략

### 1. API 에러 처리

```typescript
// 모든 API 함수는 try-catch로 에러 처리
try {
  const res = await api.get(...);
  return res.data;
} catch (e) {
  if (isAxiosError(e)) {
    console.error("API error:", e.response?.status, e.response?.data);
  }
  return null; // 기본값 반환
}
```

### 2. 인증 에러

- **401**: 자동 토큰 갱신 시도
- **Refresh 실패**: RefreshTokenExpiredError 발생 → 로그인 페이지

### 3. 전역 에러 바운더리

- **Suspense**: 로딩 상태 폴백

---

## 🎯 아키텍처 원칙

### 1. 단일 책임 원칙

- 각 컴포넌트는 하나의 명확한 역할
- API, 비즈니스 로직, UI 분리

### 2. 재사용성

- UI 컴포넌트 라이브러리화 (components/ui)
- Custom Hooks로 로직 재사용

### 3. 타입 안정성

- 모든 데이터 흐름 타입 정의
- any 사용 최소화

### 4. 성능 우선

- Lazy Loading, Code Splitting
- 효율적인 캐싱 전략

### 5. 접근성 (a11y)

- Radix UI 기반 접근성 보장
- 시맨틱 HTML 사용

---

## 📝 주요 의존성 설명

### Core

- **react**: UI 렌더링
- **typescript**: 타입 안정성
- **vite**: 빌드 도구

### State Management

- **@tanstack/react-query**: 서버 상태 관리

### Routing

- **react-router-dom**: SPA 라우팅

### Styling

- **tailwindcss**: 유틸리티 CSS
- **class-variance-authority**: 컴포넌트 변형 관리
- **tailwind-merge**: 클래스 충돌 방지

### API Communication

- **axios**: HTTP 클라이언트
- **socket.io-client**: 실시간 통신

### UI Components

- **@radix-ui/react-dialog**: 모달
- **@radix-ui/react-dropdown-menu**: 드롭다운
- **lucide-react**: 아이콘

### Internationalization

- **i18next**: 국제화 프레임워크
- **react-i18next**: React 통합
- **i18next-browser-languagedetector**: 언어 자동 감지

### 3D & Animation

- **three**: 3D 렌더링
- **@react-three/fiber**: React 통합
- **@react-three/drei**: 헬퍼
- **lottie-react**: 애니메이션

---

## 🎓 아키텍처 결정 이유 (ADR)

### React 19 선택

- **이유**: 최신 Concurrent Features, 성능 개선
- **트레이드오프**: 일부 라이브러리 호환성 이슈 가능

### Vite 선택

- **이유**: 빠른 개발 경험, 최적화된 빌드
- **트레이드오프**: CRA보다 설정이 필요할 수 있음

### TanStack Query 선택

- **이유**: 서버 상태 관리 표준, 자동 캐싱
- **트레이드오프**: 학습 곡선 존재

### 쿠키 기반 인증

- **이유**: XSS 공격 방어 (HttpOnly), 자동 전송
- **트레이드오프**: CSRF 방어 필요

### TailwindCSS 선택

- **이유**: 빠른 개발, 일관성, 최적화된 번들
- **트레이드오프**: 초기 학습 곡선, 긴 className

---

## 🔄 향후 개선 방향

1. **테스트 추가**: Unit/Integration/E2E 테스트
2. **에러 바운더리 개선**: 사용자 친화적 에러 UI
3. **성능 모니터링**: Lighthouse, Web Vitals 통합
4. **PWA 지원**: 오프라인 기능, 푸시 알림
5. **접근성 개선**: 스크린 리더 최적화
6. **CI/CD 파이프라인**: 자동 배포

---

## 📞 관련 문서

- [React 19 공식 문서](https://react.dev/)
- [Vite 공식 문서](https://vitejs.dev/)
- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [TailwindCSS 공식 문서](https://tailwindcss.com/)
- [shadcn/ui 공식 문서](https://ui.shadcn.com/)

---

**문서 작성일**: 2025-10-30
**작성자**: Winston (Architect Agent)
**버전**: 1.0.0
