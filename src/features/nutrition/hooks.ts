import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ISODate, UUID } from '@/api/types';

import { nutritionApi } from './api';
import { FoodEntryPayload } from './types';

export const nutritionKeys = {
  all: ['nutrition'] as const,
  day: (date: ISODate, timezone: string) => [...nutritionKeys.all, 'day', date, timezone] as const,
};

export function useDailyFoodEntries(date: ISODate, timezone: string) {
  return useQuery({
    queryKey: nutritionKeys.day(date, timezone),
    queryFn: () => nutritionApi.listForDay(date, timezone),
  });
}

export function useCreateFoodEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: FoodEntryPayload) => nutritionApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: nutritionKeys.all }),
  });
}

export function useUpdateFoodEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: UUID; payload: FoodEntryPayload }) =>
      nutritionApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: nutritionKeys.all }),
  });
}

export function useDeleteFoodEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: UUID) => nutritionApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: nutritionKeys.all }),
  });
}
