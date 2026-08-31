/**
 * 문자열에서 숫자만 추출
 */
export function digitsOnly(value: string): string {
  return value.replace(/\D+/g, "");
}

/**
 * 숫자를 최소/최대값으로 제한
 */
export function clampNum(num: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, num));
}

/**
 * 경매 종료 시간을 ISO 문자열로 변환
 */
export function buildEndTimeISO(duration: {
  days: number;
  hours: number;
  minutes: number;
}): string {
  const totalMs =
    ((duration.days * 24 + duration.hours) * 60 + duration.minutes) * 60 * 1000;
  return new Date(Date.now() + totalMs).toISOString();
}
