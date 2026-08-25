import { apiClient } from '@/api/client';
import { ISODate, UUID } from '@/api/types';

import { DailyHydration, WaterEntry, WaterEntryPayload } from './types';

const BASE = '/api/v1/hydration/entries';

export const hydrationApi = {
  async listForDay(date: ISODate, timezone: string): Promise<WaterEntry[]> {
    const { data } = await apiClient.get<WaterEntry[]>(BASE, {
      params: { date, timezone },
    });
    return data;
  },

  async daily(date: ISODate, timezone: string): Promise<DailyHydration> {
    const { data } = await apiClient.get<DailyHydration>('/api/v1/hydration/daily', {
      params: { date, timezone },
    });
    return data;
  },

  async create(payload: WaterEntryPayload): Promise<WaterEntry> {
    const { data } = await apiClient.post<WaterEntry>(BASE, payload);
    return data;
  },

  async update(id: UUID, payload: WaterEntryPayload): Promise<WaterEntry> {
    const { data } = await apiClient.put<WaterEntry>(`${BASE}/${id}`, payload);
    return data;
  },

  async remove(id: UUID): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`);
  },
};
