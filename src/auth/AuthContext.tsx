import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { apiClient, setAuthFailureHandler } from '@/api/client';
import { AuthResponse, User } from '@/api/types';
import { tokenStorage } from '@/auth/tokenStorage';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogleIdToken: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const applyAuthResponse = useCallback(async (res: AuthResponse) => {
    await tokenStorage.setTokens(res.accessToken, res.refreshToken);
    setUser(res.user);
  }, []);

  const clearSession = useCallback(async () => {
    await tokenStorage.clear();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const signup = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const { data } = await apiClient.post<AuthResponse>('/api/v1/auth/signup', {
        email,
        password,
        displayName,
      });
      await applyAuthResponse(data);
    },
    [applyAuthResponse],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await apiClient.post<AuthResponse>('/api/v1/auth/login', {
        email,
        password,
      });
      await applyAuthResponse(data);
    },
    [applyAuthResponse],
  );

  const loginWithGoogleIdToken = useCallback(
    async (idToken: string) => {
      const { data } = await apiClient.post<AuthResponse>('/api/v1/auth/google', {
        idToken,
      });
      await applyAuthResponse(data);
    },
    [applyAuthResponse],
  );

  const logout = useCallback(async () => {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (refreshToken) {
      // Best-effort — clear locally regardless of server response.
      apiClient.post('/api/v1/auth/logout', { refreshToken }).catch(() => undefined);
    }
    await clearSession();
  }, [clearSession]);

  const refreshMe = useCallback(async () => {
    const { data } = await apiClient.get<User>('/api/v1/users/me');
    setUser(data);
  }, []);

  // Restore session on cold start.
  useEffect(() => {
    (async () => {
      const token = await tokenStorage.getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await apiClient.get<User>('/api/v1/users/me');
        setUser(data);
      } catch {
        await clearSession();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [clearSession]);

  // Let the axios interceptor tell us when a refresh has failed permanently.
  useEffect(() => {
    setAuthFailureHandler(() => {
      clearSession();
    });
    return () => setAuthFailureHandler(null);
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      signup,
      login,
      loginWithGoogleIdToken,
      logout,
      refreshMe,
    }),
    [user, isLoading, signup, login, loginWithGoogleIdToken, logout, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
