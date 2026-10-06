# AuctionCreatePage 리팩토링 액션 아이템

## 📋 개요

**대상 파일**: `src/pages/AuctionCreatePage.tsx`
**목표**: 폼 상태 관리 및 API 호출 개선
**기술 스택**:

- React Hook Form (폼 상태 관리)
- Zod (스키마 검증)
- React Query (API 호출 및 캐싱)

---

## 🎯 리팩토링 목표

### 현재 문제점

1. **수동 상태 관리**: 각 필드마다 개별 useState 사용 (title, desc, image, startPrice, d, h, m 등)
2. **수동 검증**: 각 필드의 touched 상태를 별도로 관리 (tTitle, tDesc, tImage)
3. **복잡한 검증 로직**: valid 객체로 수동 검증 관리
4. **API 호출 상태 관리**: submitting 상태를 수동으로 관리
5. **에러 처리 부족**: try-catch로만 처리, 구체적인 에러 메시지 없음
6. **재사용성 부족**: 폼 로직이 컴포넌트에 강하게 결합됨

### 개선 목표

1. **선언적 폼 관리**: React Hook Form으로 간결한 폼 상태 관리
2. **타입 안전 검증**: Zod 스키마로 런타임 타입 검증
3. **자동 에러 처리**: React Query의 에러 상태 활용
4. **캐싱 및 리페칭**: React Query로 서버 상태 최적화
5. **코드 가독성**: 보일러플레이트 감소

---

## 📦 필수 의존성 설치

```bash
npm install react-hook-form zod @hookform/resolvers
```

### 패키지 설명

- `react-hook-form`: 고성능 폼 라이브러리
- `zod`: TypeScript 우선 스키마 검증
- `@hookform/resolvers`: React Hook Form과 Zod 통합

---

## 🔧 리팩토링 액션 아이템

### ✅ Phase 1: Zod 스키마 정의

**위치**: `src/schemas/auctionCreateSchema.ts` (새 파일)

**작업 내용**:

1. 경매 생성 폼 Zod 스키마 정의
2. TypeScript 타입 추론
3. 커스텀 검증 규칙 추가

**구현 사항**:

```typescript
// src/schemas/auctionCreateSchema.ts
import { z } from "zod";

export const auctionCreateSchema = z.object({
  title: z
    .string()
    .min(1, "상품명을 입력해주세요.")
    .max(100, "상품명은 100자 이내로 입력해주세요."),

  description: z
    .string()
    .min(1, "상품 설명을 입력해주세요.")
    .max(1000, "상품 설명은 1000자 이내로 입력해주세요."),

  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "이미지 크기는 5MB 이하여야 합니다.",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "이미지 파일만 업로드 가능합니다.",
    }),

  startPrice: z
    .number()
    .min(1, "시작가는 최소 1잔 이상이어야 합니다.")
    .max(999999, "시작가는 999,999잔을 초과할 수 없습니다."),

  duration: z
    .object({
      days: z.number().min(0).max(365),
      hours: z.number().min(0).max(23),
      minutes: z.number().min(0).max(59),
    })
    .refine(
      (data) => {
        const totalMinutes =
          data.days * 24 * 60 + data.hours * 60 + data.minutes;
        return totalMinutes >= 1;
      },
      {
        message: "경매 기간은 최소 1분 이상이어야 합니다.",
      },
    ),
});

export type AuctionCreateFormData = z.infer<typeof auctionCreateSchema>;
```

**완료 조건**:

- [ ] Zod 스키마 파일 생성
- [ ] 모든 필드 검증 규칙 정의
- [ ] TypeScript 타입 추론 확인
- [ ] 커스텀 검증 로직 테스트

---

### ✅ Phase 2: React Query Hook 생성

**위치**: `src/hooks/useCreateAuction.ts` (새 파일)

**작업 내용**:

1. `useMutation` 훅으로 경매 생성 API 래핑
2. 성공/실패 콜백 처리
3. 낙관적 업데이트 (옵션)

**구현 사항**:

```typescript
// src/hooks/useCreateAuction.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAuction, CreateAuctionRequest } from "@/apis/api";

export function useCreateAuction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAuctionRequest) => createAuction(data),
    onSuccess: (data) => {
      // 성공 시 경매 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      queryClient.invalidateQueries({ queryKey: ["myAuctions"] });
    },
    onError: (error) => {
      console.error("경매 생성 실패:", error);
    },
  });
}
```

**완료 조건**:

- [ ] useCreateAuction 훅 생성
- [ ] mutation 함수 정의
- [ ] 캐시 무효화 로직 추가
- [ ] 에러 처리 구현

---

### ✅ Phase 3: React Hook Form 통합

**위치**: `src/pages/AuctionCreatePage.tsx` (수정)

**작업 내용**:

1. `useForm` 훅으로 기존 상태 관리 대체
2. Zod 리졸버 연결
3. 필드 등록 및 에러 표시

**구현 사항**:

```typescript
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  auctionCreateSchema,
  AuctionCreateFormData,
} from "@/schemas/auctionCreateSchema";
import { useCreateAuction } from "@/hooks/useCreateAuction";

function AuctionCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateAuction();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<AuctionCreateFormData>({
    resolver: zodResolver(auctionCreateSchema),
    mode: "onBlur", // 블러 시 검증
    defaultValues: {
      title: "",
      description: "",
      startPrice: 0,
      duration: {
        days: 10,
        hours: 0,
        minutes: 0,
      },
    },
  });

  const onSubmit = async (data: AuctionCreateFormData) => {
    const endTime = calculateEndTime(data.duration);

    await createMutation.mutateAsync({
      title: data.title,
      description: data.description,
      starting_price: data.startPrice,
      end_time: endTime,
      image_file: data.image,
    });
  };

  // ... 나머지 구현
}
```

**리팩토링 체크리스트**:

- [ ] useState 제거 (title, desc, startPrice, d, h, m)
- [ ] touched 상태 제거 (tTitle, tDesc, tImage)
- [ ] valid 객체 제거
- [ ] useForm 훅으로 대체
- [ ] register로 필드 등록
- [ ] Controller로 복잡한 필드 처리 (이미지)
- [ ] errors 객체로 에러 표시

---

### ✅ Phase 4: 이미지 업로드 필드 개선

**작업 내용**:

1. Controller로 File input 래핑
2. 이미지 미리보기 로직 유지
3. 드래그 앤 드롭 기능 통합

**구현 사항**:

```typescript
<Controller
  name="image"
  control={control}
  render={({ field: { onChange, value }, fieldState: { error } }) => (
    <div className="flex flex-col gap-2">
      <label className="text-lg font-bold text-scale-600">사진</label>
      <ImageUploadField
        value={value}
        onChange={onChange}
        error={error?.message}
      />
    </div>
  )}
/>
```

**완료 조건**:

- [ ] Controller로 이미지 필드 래핑
- [ ] 드래그 앤 드롭 기능 유지
- [ ] 미리보기 기능 유지
- [ ] 에러 메시지 표시

---

### ✅ Phase 5: API 호출 및 상태 관리 개선

**작업 내용**:

1. `createMutation` 상태 활용
2. 로딩/성공/실패 상태 처리
3. 모달 표시 로직 개선

**구현 사항**:

```typescript
const { mutateAsync, isPending, isSuccess, isError } = useCreateAuction();

// 제출 핸들러
const onSubmit = handleSubmit(async (data) => {
  try {
    await mutateAsync({
      title: data.title,
      description: data.description,
      starting_price: data.startPrice,
      end_time: buildEndTimeISO(data.duration),
      image_file: data.image,
    });

    setIsInfoOpen(true);
    setIsSuccess(true);
  } catch (error) {
    setIsInfoOpen(true);
    setIsSuccess(false);
  }
});

// 버튼 상태
<Button
  variant={isValid ? "primary" : "disabled"}
  disabled={!isValid || isPending}
  onButtonClick={onSubmit}
  className="w-80 h-14"
>
  {isPending ? "등록 중 ..." : "상품 등록하기"}
</Button>
```

**완료 조건**:

- [ ] submitting 상태 제거
- [ ] mutateAsync로 API 호출
- [ ] isPending으로 로딩 상태 표시
- [ ] isSuccess/isError로 결과 처리

---

### ✅ Phase 6: 유틸리티 함수 분리

**위치**: `src/utils/auction.ts` (새 파일)

**작업 내용**:

1. `digitsOnly`, `clampNum`, `buildEndTimeISO` 분리
2. 재사용 가능한 유틸리티로 변환

**구현 사항**:

```typescript
// src/utils/auction.ts

export function digitsOnly(value: string): string {
  return value.replace(/\D+/g, "");
}

export function clampNum(num: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, num));
}

export function buildEndTimeISO(duration: {
  days: number;
  hours: number;
  minutes: number;
}): string {
  const totalMs =
    ((duration.days * 24 + duration.hours) * 60 + duration.minutes) * 60 * 1000;
  return new Date(Date.now() + totalMs).toISOString();
}
```

**완료 조건**:

- [ ] 유틸리티 함수 파일 생성
- [ ] 함수 분리 및 export
- [ ] 타입 정의 추가
- [ ] 컴포넌트에서 import

---

### ✅ Phase 7: 폼 리셋 로직 개선

**작업 내용**:

1. `reset()` 함수로 폼 초기화
2. 이미지 미리보기 초기화

**구현 사항**:

```typescript
const handleModalConfirm = () => {
  setIsInfoOpen(false);
  if (isSuccess) {
    reset(); // React Hook Form의 reset 사용
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    navigate(ROUTES.HISTORY.ROOT);
  }
};
```

**완료 조건**:

- [ ] resetForm 함수 제거
- [ ] reset() 함수로 대체
- [ ] 미리보기 상태 초기화
- [ ] 파일 input 초기화

---

### ✅ Phase 8: 에러 메시지 표시 개선

**작업 내용**:

1. Zod 에러 메시지 표시
2. API 에러 메시지 표시
3. 사용자 친화적 메시지

**구현 사항**:

```typescript
// 필드 에러 표시
{errors.title && (
  <p className="text-point-warning text-base mt-1">
    {errors.title.message}
  </p>
)}

// API 에러 표시
{isError && (
  <p className="text-point-warning text-base mt-1">
    등록에 실패했습니다. 잠시 후 다시 시도해 주세요.
  </p>
)}
```

**완료 조건**:

- [ ] 모든 필드 에러 메시지 연결
- [ ] Zod 에러 메시지 표시
- [ ] API 에러 처리
- [ ] 한글 에러 메시지 확인

---

### ✅ Phase 9: 타입 안정성 검증

**작업 내용**:

1. TypeScript 컴파일 에러 확인
2. 타입 추론 검증
3. any 타입 제거

**완료 조건**:

- [ ] `npm run build` 성공
- [ ] TypeScript 에러 0개
- [ ] 모든 타입 명시적 정의
- [ ] Zod 스키마 타입 일치

---

### ✅ Phase 10: 테스트 및 검증

**작업 내용**:

1. 기능 테스트
2. 에러 케이스 테스트
3. UX 검증

**테스트 시나리오**:

- [ ] 빈 필드 제출 시 에러 표시
- [ ] 유효한 데이터 제출 성공
- [ ] 이미지 업로드 (드래그 앤 드롭)
- [ ] 이미지 업로드 (클릭)
- [ ] 5MB 초과 이미지 에러
- [ ] 숫자 필드 검증 (시작가, 기간)
- [ ] API 실패 시 에러 모달
- [ ] 성공 시 폼 리셋
- [ ] 성공 시 히스토리 페이지 이동
- [ ] 로딩 중 버튼 비활성화

---

## 📊 리팩토링 전후 비교

### 코드 메트릭스

| 항목             | 리팩토링 전 | 리팩토링 후 | 개선율    |
| ---------------- | ----------- | ----------- | --------- |
| 컴포넌트 라인 수 | ~335줄      | ~200줄      | 40% 감소  |
| useState 개수    | 11개        | 2-3개       | 75% 감소  |
| 수동 검증 로직   | ~30줄       | 0줄         | 100% 제거 |
| 에러 처리        | 기본        | 포괄적      | +300%     |
| 타입 안정성      | 부분적      | 완전        | 100%      |

### 주요 개선 사항

1. **코드 가독성**: 보일러플레이트 40% 감소
2. **유지보수성**: 검증 로직 중앙화
3. **타입 안정성**: Zod 스키마로 런타임 검증
4. **에러 처리**: React Query의 자동 에러 관리
5. **성능**: React Hook Form의 리렌더링 최적화
6. **재사용성**: 훅과 스키마 재사용 가능

---

## 🚀 예상 효과

### 개발자 경험 (DX)

- ✅ 폼 로직 작성 시간 50% 단축
- ✅ 디버깅 시간 감소
- ✅ 타입 에러 사전 방지
- ✅ 코드 리뷰 시간 단축

### 사용자 경험 (UX)

- ✅ 즉각적인 검증 피드백
- ✅ 명확한 에러 메시지
- ✅ 부드러운 폼 인터랙션
- ✅ 로딩 상태 명확화

### 유지보수성

- ✅ 검증 규칙 중앙 관리
- ✅ API 로직 분리
- ✅ 재사용 가능한 훅
- ✅ 테스트 용이성 향상

---

## 📝 추가 개선 제안

### Optional Enhancements

1. **이미지 압축**: 업로드 전 클라이언트 사이드 압축
2. **자동 저장**: localStorage를 활용한 임시 저장
3. **입력 제안**: 이전 경매 데이터 기반 자동 완성
4. **실시간 미리보기**: 경매 카드 미리보기
5. **진행 표시**: 멀티 스텝 폼으로 전환

---

## 📚 참고 문서

- [React Hook Form 공식 문서](https://react-hook-form.com/)
- [Zod 공식 문서](https://zod.dev/)
- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [shadcn/ui Form 예제](https://ui.shadcn.com/docs/components/form)

---

**작성일**: 2025-10-30
**작성자**: James (Dev Agent)
**상태**: 준비 완료
