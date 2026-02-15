export interface AnalyticsHeading {
  title: string;
  subtitle: string;
}

export interface AnalyticsFilters {
  dateRanges: string[];
  courses: string[];
}

export type AnalyticsTrend = "up" | "down";

export interface AnalyticsStat {
  id: string;
  title: string;
  value: string;
  delta: string;
  deltaLabel: string;
  trend: AnalyticsTrend;
}

export interface AnalyticsLinePoint {
  label: string;
  value: number;
}

export interface AnalyticsBarPoint {
  label: string;
  value: number;
}

export interface AnalyticsHeatmapDay {
  day: string;
  values: number[];
}

export interface AnalyticsTopCourse {
  id: string;
  title: string;
  students: number;
  completion: number;
}

export interface AnalyticsData {
  heading: AnalyticsHeading;
  filters: AnalyticsFilters;
  stats: AnalyticsStat[];
  completionTrends: AnalyticsLinePoint[];
  quizScoreDistribution: AnalyticsBarPoint[];
  userGrowth: AnalyticsLinePoint[];
  engagementHeatmap: AnalyticsHeatmapDay[];
  topCourses: AnalyticsTopCourse[];
}
