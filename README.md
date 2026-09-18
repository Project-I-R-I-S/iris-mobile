# iris-mobile

Mobile app for **I.R.I.S** (Intelligent Rest & Insight Suite) — a diet
and wellness tracking app.

- **Framework**: Expo SDK 54 (React Native 0.81)
- **Language**: TypeScript
- **UI**: Tamagui (compile-time-optimized components, cross-platform including web)
- **Navigation**: React Navigation (native stack + bottom tabs)
- **Data**: TanStack Query + Axios
- **Auth**: JWT tokens stored in Expo SecureStore, refreshed on 401
- **Backend**: `iris-api` (Spring Boot)

## Architecture

Package-by-feature — mirrors the backend layout so features map 1:1.

```
src/
├── api/                — Axios client, TanStack Query client, shared types
├── auth/               — AuthContext, token storage, Google OAuth, screens
├── navigation/         — RootNavigator, AuthNavigator, MainTabNavigator
├── features/
│   ├── nutrition/      — food/drink logging (reference implementation)
│   ├── hydration/      — water tracking (fully built)
│   ├── weight/         — weight + BMI (fully built)
│   ├── sleep/          — sleep logging (not built — deferred)
│   ├── progress/       — dashboard (built; charts deferred)
│   └── settings/       — profile + preferences
├── components/         — shared UI helpers
├── theme/              — design tokens on top of Tamagui defaults
└── utils/              — small helpers (date formatting, etc.)
```

Each feature owns its own `types.ts`, `api.ts`, `hooks.ts`, and `screens/`.
The **nutrition** feature is the reference — copy it as the template.

## Running locally

**Prerequisites**: Node 20+, Expo CLI (bundled with npx), Expo Go app on your
phone OR an iOS simulator / Android emulator.

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in
cp .env.example .env
# edit .env — API_BASE_URL should point at your running iris-api

# 3. Make sure iris-api is running (see that repo's README)

# 4. Start Expo
npm start
```

Then either:
- **On phone**: open Expo Go and scan the QR code
- **iOS simulator**: press `i`
- **Android emulator**: press `a`

### API base URL cheat sheet

- iOS simulator: `http://localhost:8080` works
- Android emulator: use `http://10.0.2.2:8080` (10.0.2.2 = host's localhost)
- Physical device: use your machine's LAN IP, e.g. `http://192.168.1.10:8080`

### Google Sign-In setup

1. Go to Google Cloud Console → APIs & Services → Credentials.
2. Create three OAuth 2.0 client IDs: iOS, Android, Web.
3. For Android, register the SHA-1 from `eas credentials` (or `keytool`).
4. Set `GOOGLE_CLIENT_ID_IOS` / `GOOGLE_CLIENT_ID_ANDROID` / `GOOGLE_CLIENT_ID_WEB`
   in `.env` — `app.config.ts` reads them via `process.env` at config-eval time.

Note: the current beta build hides the Google Sign-In button (email-only auth)
until these client IDs are configured for the deployed domain.

## Deploy (web beta)

The web beta is hosted on Vercel, built via `npx expo export -p web` (config
in `vercel.json`; the SPA rewrite is required because React Navigation does
client-side routing, not file-based routes).

Set these environment variables in the Vercel project's
**Settings → Environment Variables** (same names as `.env.example`):

- `API_BASE_URL` — the deployed `iris-api` base URL (placeholder until
  `iris-api` is live; update and redeploy once it is)
- `GOOGLE_CLIENT_ID_WEB` — optional; leave unset to keep Google Sign-In hidden

No other setup is needed — Vercel picks up `buildCommand` and
`outputDirectory` from `vercel.json`.

## Adding a new feature

1. Copy `src/features/nutrition/` as a template.
2. Rename files and update types to match the backend.
3. Register screens in `MainTabNavigator` or add a stack modal in `RootNavigator`.

## Building for production

```bash
# Install EAS CLI once
npm install -g eas-cli

# First-time setup
eas build:configure

# Build
eas build --platform ios
eas build --platform android
```

## License

Private / TBD.
