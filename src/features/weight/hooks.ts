import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ISODate, UUID } from '@/api/types';

import { weightApi } from './api';
import { WeightEntryPayload } from './types';

export const weightKeys = {
  all: ['weight'] as const,
  range: (from: ISODate, to: ISODate, timezone: string) =>
    [...weightKeys.all, 'range', from, to, timezone] as const,
  latest: () => [...weightKeys.all, 'latest'] as const,
};

export function useWeightEntries(from: ISODate, to: ISODate, timezone: string) {
  return useQuery({
    queryKey: weightKeys.range(from, to, timezone),
    queryFn: () => weightApi.listInRange(from, to, timezone),
  });
}

export function useLatestWeight() {
  return useQuery({
    queryKey: weightKeys.latest(),
    queryFn: () => weightApi.latest(),
    retry: false,
  });
}

export function useCreateWeightEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: WeightEntryPayload) => weightApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: weightKeys.all }),
  });
}

export function useUpdateWeightEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: UUID; payload: WeightEntryPayload }) =>
      weightApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: weightKeys.all }),
  });
}

export function useDeleteWeightEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: UUID) => weightApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: weightKeys.all }),
  });
}
