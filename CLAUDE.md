# CLAUDE.md — iris-mobile

Context for Claude Code sessions working in this repo.

## Project

**I.R.I.S** — a mobile-first diet and wellness tracking app. This repo is the
**mobile client**. Backend lives in `iris-api` (Spring Boot + Postgres).

The mobile app talks to `iris-api` via REST — it never talks to the DB directly.

## Stack

- Expo SDK 54, React Native 0.81, TypeScript strict mode
- Tamagui for UI (compile-time optimized, cross-platform including web)
- React Navigation (native stack + bottom tabs) — **not** Expo Router
- TanStack Query for server state, Axios for HTTP
- Expo SecureStore for JWT tokens
- `expo-auth-session` for Google Sign-In (ID token flow)

## Architectural rules — please follow

1. **Package-by-feature.** Each feature owns its own `types.ts`, `api.ts`,
   `hooks.ts`, and `screens/`. Cross-feature calls go through the other
   feature's exported hooks, not by reaching into its api layer.

2. **Screens are dumb-ish.** They call hooks (`useDailyFoodEntries`,
   `useCreateFoodEntry`), render UI, handle navigation. No axios calls
   or business logic inline in screens.

3. **All server calls go through `apiClient`.** Never use bare `fetch` or
   a new axios instance — you'd bypass the auth interceptor and refresh flow.

4. **All server state goes through TanStack Query.** Don't put server data
   in `useState`. Use `useQuery` for reads and `useMutation` for writes.
   Invalidate the right query keys after mutations.

5. **Query keys are defined in `<feature>/hooks.ts`** as a keys object
   (see `nutritionKeys`). This keeps invalidation targets consistent.

6. **Never store tokens outside `tokenStorage`.** No AsyncStorage for
   tokens. Use `tokenStorage` (SecureStore-backed).

7. **Types come from `src/api/types.ts` for cross-cutting types**
   (`User`, `AuthResponse`), and from `<feature>/types.ts` for
   feature-specific types. When backend DTOs change, update these first.

8. **UI comes from Tamagui.** Prefer Tamagui components (`YStack`, `Button`,
   `Input`, `H2`) over raw React Native primitives. Use `$` tokens for
   spacing, colors, and typography — don't hardcode pixel values.

9. **Path alias `@/` = `src/`.** Configured in `tsconfig.json` and
   `babel.config.js`. Import as `@/features/nutrition/hooks`.

## Reference implementation

The **nutrition** feature is the fully-fleshed-out reference:

- `src/features/nutrition/types.ts` — DTOs matching backend
- `src/features/nutrition/api.ts` — axios calls, one function per endpoint
- `src/features/nutrition/hooks.ts` — TanStack Query hooks + key definitions
- `src/features/nutrition/screens/NutritionListScreen.tsx` — list + daily totals
- `src/features/nutrition/screens/AddFoodScreen.tsx` — form

When building hydration/weight/sleep, copy this structure. Each of those
directories has a `README.md` with feature-specific notes.

## Auth flow

1. On cold start, `AuthContext` reads the access token from `SecureStore`.
2. If a token exists, we call `GET /api/v1/users/me` to validate it and
   load the user object.
3. If the token is expired/invalid, the axios interceptor tries a refresh
   using the refresh token. On success, the request is retried transparently.
4. On refresh failure, the interceptor calls the failure handler
   (registered by `AuthContext`) which clears the session — the UI
   automatically drops back to the Auth stack.

## v1 scope (locked)

- Manual food logging (solid + drinks, with fluidMl + caffeineMg fields)
- Water tracking
- Weight + BMI
- Sleep logging (manual)
- Multi-method auth: email + Google
- Reminders (local notifications for water/sleep/end-of-day)
- Progress visualizations (dashboard + charts)
- Dark/light theme (Tamagui handles this via `defaultTheme`)

## Deferred (do not build unless asked)

- Photo-based food logging (v1.1) — will use camera + LLM via backend
- Recipe analysis (v1.1)
- HealthKit / Health Connect step sync (later)
- Web build (later — Tamagui supports it, we just haven't set it up)
- Smoking/alcohol tracking (later)
- Fitness tracker sync (later)
- Workout tracking (v2)
- Progression checkpoints, rewards, gamification (later)

## Things I appreciate

- Ask before adding a new npm dependency, especially anything native
  (something that requires `expo prebuild` or a config plugin).
- Prefer smaller, focused PRs — one feature per branch.
- If a backend DTO shape has changed, update `src/api/types.ts` or
  `<feature>/types.ts` in the same PR that consumes the change.
- If you're unsure whether something belongs in `src/components/` or in
  a feature, default to the feature. Extract to `components/` only when
  a second feature actually needs the same thing.
