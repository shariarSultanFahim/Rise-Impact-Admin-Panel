export type GrowthType = "increase" | "decrease" | "no_change";

export interface ApiResponseBase {
  success: boolean;
  message: string;
}

export interface Statistic {
  value: number;
  growth: number;
  growthType: GrowthType;
}

export interface RatingDistributionBucket {
  rating: number;
  count: number;
}

export interface FeedbackAdminSummary {
  comparisonPeriod: string;
  totalReviews: Statistic;
  averageRating: Statistic;
  pendingResponses: number;
  ratingDistribution: RatingDistributionBucket[];
}

export interface FeedbackAdminSummaryResponse extends ApiResponseBase {
  data: FeedbackAdminSummary;
}

export interface FeedbackAdminStudent {
  _id: string;
  name: string;
  email: string;
  profilePicture: string | null;
}

export interface FeedbackAdminCourse {
  _id: string;
  title: string;
  slug: string;
}

export interface FeedbackAdminItem {
  _id: string;
  student: FeedbackAdminStudent;
  course: FeedbackAdminCourse;
  rating: number;
  review: string;
  adminResponse: string | null;
  respondedAt: string | null;
  createdAt: string;
}

export interface FeedbackAdminQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  searchTerm?: string;
  course?: string;
  rating?: number;
}

export interface FeedbackAdminPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface FeedbackAdminListResponse extends ApiResponseBase {
  pagination: FeedbackAdminPagination;
  data: FeedbackAdminItem[];
}

export interface FeedbackAdminDetailResponse extends ApiResponseBase {
  data: FeedbackAdminItem;
}

export interface FeedbackRespondPayload {
  adminResponse: string;
}

export interface FeedbackRespondData {
  _id: string;
  adminResponse: string;
  respondedAt: string;
}

export interface FeedbackRespondResponse extends ApiResponseBase {
  data: FeedbackRespondData;
}

export interface FeedbackDeleteResponse extends ApiResponseBase {}

export interface CourseOption {
  _id: string;
  title: string;
}

export interface CourseOptionsResponse extends ApiResponseBase {
  data: CourseOption[];
}
