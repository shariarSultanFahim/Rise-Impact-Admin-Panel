export type CourseManageStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "SCHEDULED";

export interface CourseManageQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sort?: string;
  status?: CourseManageStatus | "";
}

export interface CourseManageItem {
  _id: string;
  title: string;
  slug: string;
  status: CourseManageStatus;
  thumbnail: string;
  publishScheduledAt: string | null;
  description: string;
  totalLessons: number;
  totalDuration: number;
  averageRating: number;
  ratingsCount: number;
  enrollmentCount: number;
  createdAt: string;
  updatedAt: string;
  modules: [];
  curriculum: [];
}

export interface CourseManagePagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface CourseManageResponse {
  success: boolean;
  message: string;
  pagination: CourseManagePagination;
  data: CourseManageItem[];
}
