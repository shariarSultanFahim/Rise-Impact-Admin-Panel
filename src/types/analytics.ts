export type AnalyticsPeriod = "week" | "month" | "quarter" | "year";
export type AnalyticsDateRange = "7d" | "30d" | "3m" | "6m" | "12m";

export type AnalyticsExportType = "courses" | "quizzes" | "engagement";
export type AnalyticsExportFormat = "csv" | "xlsx";

export interface AnalyticsLinePoint {
  label: string;
  value: number;
}

export interface AnalyticsHeatmapDay {
  day: string;
  values: number[];
}

export interface AnalyticsHeatmapItem {
  date: string;
  activeUsers: number;
  intensity: number;
}

export interface AnalyticsTopCourse {
  id: string;
  title: string;
  students: number;
  completion: number;
}

export interface AnalyticsCourseOption {
  _id: string;
  title: string;
}

export interface AnalyticsCourseOptionsResponse {
  success: boolean;
  message?: string;
  data: AnalyticsCourseOption[];
}

export interface AnalyticsCourseCompletionItem {
  courseId: string;
  title: string;
  totalEnrollments: number;
  completedEnrollments: number;
  completionRate: number;
}

export interface AnalyticsCourseCompletionResponse {
  success: boolean;
  message: string;
  data: AnalyticsCourseCompletionItem[];
}

export interface AnalyticsEngagementHeatmapResponse {
  success: boolean;
  message: string;
  data: AnalyticsHeatmapItem[];
}

export interface AnalyticsQuizPerformanceItem {
  title: string;
  avgScore: number;
  totalAttempts: number;
  passRate: number;
}

export interface AnalyticsPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface AnalyticsQuizPerformanceResponse {
  success: boolean;
  message: string;
  pagination: AnalyticsPagination;
  data: AnalyticsQuizPerformanceItem[];
}

export interface ExportAnalyticsResult {
  fileName: string;
  blob: Blob;
}
