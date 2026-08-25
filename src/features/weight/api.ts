import { apiClient } from '@/api/client';
import { ISODate, UUID } from '@/api/types';

import { WeightEntry, WeightEntryPayload } from './types';

const BASE = '/api/v1/weight/entries';

export const weightApi = {
  async listInRange(from: ISODate, to: ISODate, timezone: string): Promise<WeightEntry[]> {
    const { data } = await apiClient.get<WeightEntry[]>(BASE, {
      params: { from, to, timezone },
    });
    return data;
  },

  async latest(): Promise<WeightEntry> {
    const { data } = await apiClient.get<WeightEntry>(`${BASE}/latest`);
    return data;
  },

  async create(payload: WeightEntryPayload): Promise<WeightEntry> {
    const { data } = await apiClient.post<WeightEntry>(BASE, payload);
    return data;
  },

  async update(id: UUID, payload: WeightEntryPayload): Promise<WeightEntry> {
    const { data } = await apiClient.put<WeightEntry>(`${BASE}/${id}`, payload);
    return data;
  },

  async remove(id: UUID): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`);
  },
};
