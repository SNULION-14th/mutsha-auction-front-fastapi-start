export function toAbsoluteUrl(raw?: string | null): string {
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";
  const path = String(raw).replace(/^\/+/, "") || "";
  return `${base}/${path}`;
}
