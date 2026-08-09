# weight

Weight logging + BMI display. Mirror the `nutrition` feature structure:

- `types.ts` — `WeightEntry` interface (backend also returns derived BMI)
- `api.ts`, `hooks.ts` — CRUD + latest
- `screens/WeightScreen.tsx` — latest weight, BMI, trend chart (use Victory or Recharts)
- `screens/AddWeightScreen.tsx` — quick log

Show BMI only when `user.heightCm` is set; otherwise prompt to set height in Settings.
