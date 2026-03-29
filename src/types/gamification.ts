export interface ApiResponseBase {
  success: boolean;
  message: string;
}

export interface GamificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export type GamificationBadgeCriteriaType =
  | "POINTS_THRESHOLD"
  | "COURSES_COMPLETED"
  | "QUIZZES_PASSED"
  | "PERFECT_QUIZ"
  | "STREAK_DAYS"
  | "CUSTOM";

export interface GamificationBadgeCriteria {
  type: GamificationBadgeCriteriaType;
  threshold: number;
}

export interface GamificationBadgeItem {
  _id: string;
  name: string;
  icon: string;
  criteria: GamificationBadgeCriteria;
  isActive: boolean;
  description?: string;
}

export interface GamificationBadgeQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sort?: string;
}

export interface GamificationBadgeListResponse extends ApiResponseBase {
  pagination: GamificationPagination;
  data: GamificationBadgeItem[];
}

export interface UpdateGamificationBadgePayload {
  description?: string;
  criteria?: {
    threshold?: number;
  };
  isActive?: boolean;
}

export interface UpdateGamificationBadgeResponse extends ApiResponseBase {
  data: GamificationBadgeItem;
}

export interface GamificationLeaderboardItem {
  studentId: string;
  name: string;
  profilePicture: string | null;
  totalPoints: number;
  badgeCount: number;
}

export interface GamificationLeaderboardQueryParams {
  page?: number;
  limit?: number;
}

export interface GamificationLeaderboardResponse extends ApiResponseBase {
  pagination: GamificationPagination;
  data: GamificationLeaderboardItem[];
}
