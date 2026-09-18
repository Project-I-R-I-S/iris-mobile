import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';

import { tokenStorage } from '@/auth/tokenStorage';

const API_BASE_URL =
  (Constants.expoConfig?.extra?.apiBaseUrl as string) ?? 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Callback the AuthContext registers so the interceptor can clear session
 * state when a refresh fails. Keeps the API layer decoupled from React.
 */
let onAuthFailure: (() => void) | null = null;
export function setAuthFailureHandler(handler: (() => void) | null): void {
  onAuthFailure = handler;
}

// -------- Request: attach bearer token --------
apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------- Response: refresh on 401 (single flight) --------
let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    // Bare axios call so we skip our own interceptors.
    const res = await axios.post(
      `${API_BASE_URL}/api/v1/auth/refresh`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } },
    );
    const { accessToken, refreshToken: newRefresh } = res.data;
    await tokenStorage.setTokens(accessToken, newRefresh);
    return accessToken;
  } catch {
    await tokenStorage.clear();
    return null;
  }
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retried?: boolean }) | undefined;

    if (!original || error.response?.status !== 401 || original._retried) {
      return Promise.reject(error);
    }

    // Avoid a refresh loop if the refresh endpoint itself 401s.
    if (
      original.url?.includes('/auth/refresh') ||
      original.url?.includes('/auth/login') ||
      original.url?.includes('/auth/signup')
    ) {
      return Promise.reject(error);
    }

    original._retried = true;

    refreshInFlight = refreshInFlight ?? refreshAccessToken();
    const newAccess = await refreshInFlight;
    refreshInFlight = null;

    if (!newAccess) {
      onAuthFailure?.();
      return Promise.reject(error);
    }

    if (original.headers) {
      (original.headers as Record<string, string>).Authorization = `Bearer ${newAccess}`;
    }
    return apiClient(original);
  },
);
