import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'iris.accessToken';
const REFRESH_TOKEN_KEY = 'iris.refreshToken';

// expo-secure-store has no web implementation — there's no OS keychain to
// back it, so every method throws there. Left unhandled, that hangs the app
// on an infinite loading spinner (AuthContext's cold-start check never
// reaches `setIsLoading(false)`). `localStorage` is the standard browser
// fallback for local/dev use; native builds are unaffected and keep using
// the OS keychain via SecureStore, same as before.
const isWeb = Platform.OS === 'web';

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    if (isWeb) return localStorage.getItem(ACCESS_TOKEN_KEY);
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
  async getRefreshToken(): Promise<string | null> {
    if (isWeb) return localStorage.getItem(REFRESH_TOKEN_KEY);
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },
  async setTokens(access: string, refresh: string): Promise<void> {
    if (isWeb) {
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      return;
    }
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh),
    ]);
  },
  async clear(): Promise<void> {
    if (isWeb) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return;
    }
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },
};
