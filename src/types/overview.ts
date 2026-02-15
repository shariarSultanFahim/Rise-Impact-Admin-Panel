export type OverviewIconKey =
  | "students"
  | "courses"
  | "completion"
  | "approvals"
  | "feedback"
  | "discussion"
  | "badges"
  | "activity-student"
  | "activity-quiz"
  | "activity-feedback"
  | "activity-badge";

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
  completionTrends: OverviewCompletionTrends[];
  activities: OverviewActivity[];
  summaries: OverviewSummary[];
}
