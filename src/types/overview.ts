export type OverviewIconKey =
  | "students"
  | "courses"
  | "completion"
  | "approvals"
  | "feedback"
  | "discussion"
  | "badges"
  | "activity-student"
  | "activity-completion"
  | "activity-quiz";

export type GrowthType = "increase" | "decrease" | "no_change";

export type ActivityType = "ENROLLMENT" | "COMPLETION" | "QUIZ_ATTEMPT";

export type TrendPeriod = "7d" | "30d" | "3m" | "6m" | "12m";

export interface ApiResponseBase {
  success: boolean;
  message: string;
}

export interface Statistic {
  value: number;
  growth: number;
  growthType: GrowthType;
}

export interface DashboardSummary {
  comparisonPeriod: string;
  totalStudents: Statistic;
  activeStudents: Statistic;
  totalCourses: Statistic;
  completionRate: Statistic;
}

export interface DashboardSummaryResponse extends ApiResponseBase {
  data: DashboardSummary;
}

export interface TrendPoint {
  period: string;
  label: string;
  count: number;
}

export interface DashboardTrends {
  enrollmentTrends: TrendPoint[];
  completionTrends: TrendPoint[];
}

export interface DashboardTrendsResponse extends ApiResponseBase {
  data: DashboardTrends;
}

export interface DashboardRecentActivityItem {
  _id: string;
  type: ActivityType;
  title: string;
  timestamp: string;
}

export interface DashboardRecentActivityResponse extends ApiResponseBase {
  data: DashboardRecentActivityItem[];
}

export interface OverviewHeading {
  title: string;
  subtitle: string;
}

export interface OverviewStat {
  id: string;
  title: string;
  value: string;
  delta: string;
  deltaLabel: string;
  deltaType?: GrowthType;
  icon: OverviewIconKey;
}

export interface OverviewActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: OverviewIconKey;
}

export interface OverviewCompletionTrends {
  label: string;
  value: number;
}

export interface OverviewEnrollmentTrends {
  label: string;
  value: number;
}

export interface OverviewSummary {
  id: string;
  title: string;
  value: string;
  label: string;
  subtitle: string;
  icon: OverviewIconKey;
}

export interface OverviewData {
  heading: OverviewHeading;
  stats: OverviewStat[];
  enrollmentTrends: OverviewEnrollmentTrends[];
  completionTrends: OverviewCompletionTrends[];
  activities: OverviewActivity[];
}
