export type UUID = string;
export type ISODateTime = string; // ISO-8601 instant
export type ISODate = string;     // YYYY-MM-DD
export type ISOTime = string;     // HH:mm:ss

export interface User {
  id: UUID;
  email: string;
  displayName: string | null;
  dateOfBirth: ISODate | null;
  sex: string | null;
  heightCm: number | null;
  dayStartTime: ISOTime;
  dayEndTime: ISOTime;
  timezone: string;
  dailyWaterGoalMl: number;
  dailyCalorieGoal: number | null;
  dailyCaffeineLimitMg: number;
  emailVerified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresInSeconds: number;
  user: User;
}

export interface ApiError {
  timestamp: ISODateTime;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: Array<{ field: string; message: string }>;
}
