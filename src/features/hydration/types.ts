import { ISODateTime } from '@/api/types';

export interface WaterEntry {
  id: string;
  amountMl: number;
  consumedAt: ISODateTime;
  createdAt: ISODateTime;
}

export interface WaterEntryPayload {
  amountMl: number;
  consumedAt: ISODateTime;
}

export interface DailyHydration {
  date: string;
  waterMl: number;
  fluidFromFoodMl: number;
  totalMl: number;
  goalMl: number | null;
  remainingMl: number | null;
}
