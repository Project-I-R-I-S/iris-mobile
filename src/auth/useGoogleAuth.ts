import Constants from 'expo-constants';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect } from 'react';

import { useAuth } from '@/auth/AuthContext';

WebBrowser.maybeCompleteAuthSession();

/**
 * Kicks off the Google Sign-In flow, verifies the ID token against our
 * backend via AuthContext, and updates session state.
 *
 * Client IDs come from app.json → expo.extra.googleClientId*. You'll need
 * to create OAuth credentials in Google Cloud Console and set them there.
 */
export function useGoogleAuth() {
  const { loginWithGoogleIdToken } = useAuth();

  const extra = Constants.expoConfig?.extra ?? {};
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: extra.googleClientIdIos as string | undefined,
    androidClientId: extra.googleClientIdAndroid as string | undefined,
    webClientId: extra.googleClientIdWeb as string | undefined,
  });

  useEffect(() => {
    if (response?.type === 'success' && response.params.id_token) {
      loginWithGoogleIdToken(response.params.id_token).catch(() => undefined);
    }
  }, [response, loginWithGoogleIdToken]);

  const signInWithGoogle = useCallback(async () => {
    await promptAsync();
  }, [promptAsync]);

  return {
    signInWithGoogle,
    isReady: !!request,
  };
}
