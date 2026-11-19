// src/services/api.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const LOGIN_URL = '/auth/admin/login';
const REFRESH_URL = '/auth/refresh';

// 1. Create the Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Send cookies (access + refresh token) with every request to the backend.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Separate bare client for the refresh call so it never passes through the
// interceptor below (a 401 on refresh must not trigger another refresh).
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// One refresh at a time: every request that 401s while a refresh is in
// flight waits on the same promise instead of firing its own refresh.
let refreshPromise: Promise<void> | null = null;

const refreshAccessToken = (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post(REFRESH_URL)
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

const redirectToLogin = () => {
  if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
};

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

// 2. Response Interceptor: refresh the access token on 401, then retry
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequest | undefined;
    const url = originalRequest?.url ?? '';

    const isUnauthorized = error.response?.status === 401;
    const isAuthCall = url.includes(LOGIN_URL) || url.includes(REFRESH_URL);

    // Not a 401, or a failed login attempt: let the caller handle it.
    if (!isUnauthorized || !originalRequest || isAuthCall) {
      return Promise.reject(error);
    }

    // Already retried once after a refresh and still unauthorized.
    if (originalRequest._retry) {
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Backend reads the refresh token cookie and sets a new access token cookie.
      await refreshAccessToken();
    } catch {
      // Refresh token expired or missing: session is over.
      redirectToLogin();
      return Promise.reject(error);
    }

    // Replay the original request with the new cookie.
    return api(originalRequest);
  }
);
