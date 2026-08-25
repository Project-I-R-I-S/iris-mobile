import { ISODateTime } from '@/api/types';

export interface WeightEntry {
  id: string;
  weightKg: number;
  recordedAt: ISODateTime;
  notes: string | null;
  bmi: number | null;
  createdAt: ISODateTime;
}

export interface WeightEntryPayload {
  weightKg: number;
  recordedAt: ISODateTime;
  notes?: string;
}
