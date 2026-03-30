import type { UserManageRole, UserManageStatus } from "./users-manage";

export interface UserDetailsStreak {
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

export interface UserDetailsCourseStats {
  total: number;
  active: number;
  completed: number;
  averageCompletion: number;
}

export interface UserEnrolledCourse {
  courseId: string;
  title: string;
  thumbnail: string;
  status: string;
  completionPercentage: number;
  enrolledAt: string;
  lastAccessedAt: string | null;
}

export interface UserManageDetailsItem {
  _id: string;
  name: string;
  role?: UserManageRole;
  email: string;
  profilePicture?: string;
  status: UserManageStatus;
  verified: boolean;
  totalPoints: number;
  streak: UserDetailsStreak;
  createdAt: string;
  lastActiveDate: string | null;
  courseStats: UserDetailsCourseStats;
  enrolledCourses: UserEnrolledCourse[];
}

export interface UserManageDetailsResponse {
  success: boolean;
  message: string;
  data: UserManageDetailsItem;
}
