# sleep

Sleep logging (manual for v1). Mirror the `nutrition` feature structure:

- `types.ts` — `SleepEntry` with `sleptAt`, `wokeAt`, `quality`, derived `durationMinutes`
- `api.ts`, `hooks.ts` — CRUD + latest
- `screens/SleepScreen.tsx` — list of recent sleep sessions with duration + quality
- `screens/AddSleepScreen.tsx` — bedtime/wake-time pickers

Later drop: sync from HealthKit (iOS) / Health Connect (Android) — will need
`react-native-health` and `react-native-health-connect` respectively.
