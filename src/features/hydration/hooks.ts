import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ISODate, UUID } from '@/api/types';

import { hydrationApi } from './api';
import { WaterEntryPayload } from './types';

export const hydrationKeys = {
  all: ['hydration'] as const,
  day: (date: ISODate, timezone: string) => [...hydrationKeys.all, 'day', date, timezone] as const,
  daily: (date: ISODate, timezone: string) =>
    [...hydrationKeys.all, 'daily', date, timezone] as const,
};

export function useDailyWaterEntries(date: ISODate, timezone: string) {
  return useQuery({
    queryKey: hydrationKeys.day(date, timezone),
    queryFn: () => hydrationApi.listForDay(date, timezone),
  });
}

export function useDailyHydration(date: ISODate, timezone: string) {
  return useQuery({
    queryKey: hydrationKeys.daily(date, timezone),
    queryFn: () => hydrationApi.daily(date, timezone),
  });
}

export function useAddWater() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: WaterEntryPayload) => hydrationApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: hydrationKeys.all }),
  });
}

export function useUpdateWater() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: UUID; payload: WaterEntryPayload }) =>
      hydrationApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: hydrationKeys.all }),
  });
}

export function useDeleteWater() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: UUID) => hydrationApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: hydrationKeys.all }),
  });
}
