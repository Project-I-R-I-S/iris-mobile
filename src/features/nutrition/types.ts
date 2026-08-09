import { ISODateTime, UUID } from '@/api/types';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink';

export interface FoodEntry {
  id: UUID;
  name: string;
  brand: string | null;
  mealType: MealType;
  servingSize: number;
  servingUnit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sugarG: number | null;
  sodiumMg: number | null;
  caffeineMg: number;
  fluidMl: number | null;
  notes: string | null;
  consumedAt: ISODateTime;
}

export interface FoodEntryPayload {
  name: string;
  brand?: string;
  mealType: MealType;
  servingSize: number;
  servingUnit: string;
  calories: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  fiberG?: number;
  sugarG?: number;
  sodiumMg?: number;
  caffeineMg?: number;
  fluidMl?: number;
  notes?: string;
  consumedAt: ISODateTime;
}
