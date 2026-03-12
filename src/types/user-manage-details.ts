import type { UserManageRole, UserManageStatus } from "./users-manage";

export interface UserDetailsStreak {
  _id: string;
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

export interface UserDetailsCourseStats {
  total: number;
  active: number;
  completed: number;
  dropped: number;
  averageCompletion: number;
}

export interface UserManageDetailsItem {
  _id: string;
  name: string;
  role: UserManageRole;
  email: string;
  gender: string;
  dateOfBirth: string;
  profilePicture: string;
  status: UserManageStatus;
  verified: boolean;
  averageRating: number;
  ratingsCount: number;
  achievements: unknown[];
  totalPoints: number;
  streak: UserDetailsStreak;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastActiveDate: string | null;
  courseStats: UserDetailsCourseStats;
  enrolledCourses: unknown[];
}

export interface UserManageDetailsResponse {
  success: boolean;
  message: string;
  data: UserManageDetailsItem;
}
