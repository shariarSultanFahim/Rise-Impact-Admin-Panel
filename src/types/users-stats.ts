export interface UserStatsPeriodMetric {
  total: number;
  thisPeriodCount: number;
  lastPeriodCount: number;
  growth: number;
  formattedGrowth: string;
  growthType: "increase" | "decrease" | "no_change";
}

export interface UsersStatsData {
  totalStudents: UserStatsPeriodMetric;
  activeStudents: UserStatsPeriodMetric;
}

export interface UsersStatsResponse {
  success: boolean;
  message: string;
  data: UsersStatsData;
}
