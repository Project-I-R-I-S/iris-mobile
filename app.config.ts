import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'I.R.I.S',
  slug: 'iris-mobile',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  assetBundlePatterns: ['**/*'],
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0B1220',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.iris.app',
  },
  android: {
    package: 'com.iris.app',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0B1220',
    },
  },
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
  },
  plugins: ['expo-secure-store', 'expo-web-browser'],
  extra: {
    apiBaseUrl: process.env.API_BASE_URL ?? 'http://localhost:8080',
    googleClientIdIos: process.env.GOOGLE_CLIENT_ID_IOS ?? '',
    googleClientIdAndroid: process.env.GOOGLE_CLIENT_ID_ANDROID ?? '',
    googleClientIdWeb: process.env.GOOGLE_CLIENT_ID_WEB ?? '',
  },
  scheme: 'iris',
};

export default config;
