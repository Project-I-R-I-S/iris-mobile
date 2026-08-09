import { apiClient } from '@/api/client';
import { ISODate, UUID } from '@/api/types';

import { FoodEntry, FoodEntryPayload } from './types';

const BASE = '/api/v1/nutrition/entries';

export const nutritionApi = {
  async listForDay(date: ISODate, timezone: string): Promise<FoodEntry[]> {
    const { data } = await apiClient.get<FoodEntry[]>(BASE, {
      params: { date, timezone },
    });
    return data;
  },

  async create(payload: FoodEntryPayload): Promise<FoodEntry> {
    const { data } = await apiClient.post<FoodEntry>(BASE, payload);
    return data;
  },

  async update(id: UUID, payload: FoodEntryPayload): Promise<FoodEntry> {
    const { data } = await apiClient.put<FoodEntry>(`${BASE}/${id}`, payload);
    return data;
  },

  async remove(id: UUID): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`);
  },
};
