export const numberCommaFormatter = Intl.NumberFormat("ko-kr", {
  compactDisplay: "long",
}).format;

export const formatNumber = (value: number): string => {
  return value.toLocaleString("ko-KR");
};

export const extractDigits = (value: string): string =>
  value.replace(/[^\d]/g, "");
