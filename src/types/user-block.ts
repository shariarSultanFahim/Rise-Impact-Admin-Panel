import type { UserManageRole, UserManageStatus } from "./users-manage";

export interface UserBlockStreak {
  _id: string;
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

export interface UserBlockData {
  _id: string;
  name: string;
  role: UserManageRole;
  email: string;
  gender: string;
  dateOfBirth: string;
  profilePicture: string;
  status: UserManageStatus;
  verified: boolean;
  deviceTokens: unknown[];
  averageRating: number;
  ratingsCount: number;
  achievements: unknown[];
  totalPoints: number;
  streak: UserBlockStreak;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserBlockResponse {
  success: boolean;
  message: string;
  data: UserBlockData;
}
