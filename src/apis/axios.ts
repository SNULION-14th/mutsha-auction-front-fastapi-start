import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true, // 쿠키 포함
});

// // 스켈레톤 테스트용 코드
// const SLOW_MS = 1500;
// function sleep(ms: number) {
//   return new Promise((r) => setTimeout(r, ms));
// }

// api.interceptors.response.use(
//   async (res) => {
//     if (SLOW_MS > 0) await sleep(SLOW_MS);
//     return res;
//   },
//   async (err) => {
//     if (SLOW_MS > 0) await sleep(SLOW_MS);
//     return Promise.reject(err);
//   },
// );

// 쿠키에서 토큰을 가져오는 함수
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // 쿠키에서 access_token 확인 (withCredentials: true로 쿠키 자동 전송)
  // 백엔드에서 쿠키로 인증하므로 헤더에 별도로 토큰을 설정하지 않음
  return config;
});

// Response interceptor to handle 401 errors and token refresh
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config;

    // Don't retry if this is the refresh endpoint itself (prevents infinite loop)
    const isRefreshEndpoint = originalRequest?.url?.includes("/user/refresh/");

    // If any API call fails with 401, try to refresh the token
    if (err.response?.status === 401 && originalRequest && !isRefreshEndpoint) {
      try {
        // Call /user/refresh/ to get a new access token
        await api.post("/user/refresh/", {});

        // After getting refreshed access token, retry the original request
        return api.request(originalRequest);
      } catch (refreshError) {
        // If refresh API also returns 401, redirect to signin
        if (
          refreshError instanceof AxiosError &&
          refreshError.response?.status === 401
        ) {
          return Promise.reject(
            new RefreshTokenExpiredError("Refresh token expired"),
          );
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err instanceof Error ? err : new Error(String(err)));
  },
);

class RefreshTokenExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RefreshTokenExpiredError";
  }
}
