# hydration

Water tracking. Mirror the `nutrition` feature structure:

- `types.ts` — `WaterEntry` interface
- `api.ts` — `hydrationApi` with `listForDay`, `create`, `remove`
- `hooks.ts` — `useDailyWaterEntries`, `useAddWater`, `useDeleteWater`
- `screens/HydrationScreen.tsx` — quick-add buttons (+250ml, +500ml, custom)
  and today's total against `user.dailyWaterGoalMl`

Add a "Hydration" tab to `MainTabNavigator` when built.
