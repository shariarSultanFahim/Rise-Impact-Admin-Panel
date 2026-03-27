"use client";

import { useMemo, useState } from "react";

import type {
  DashboardRecentActivityItem,
  DashboardSummary,
  DashboardTrends,
  GrowthType,
  OverviewData,
  OverviewIconKey,
  Statistic,
  TrendPeriod
} from "@/types/overview";

import { useGetDashboardRecentActivity } from "@/lib/api/overview/get-recent-activity";
import { useGetDashboardSummary } from "@/lib/api/overview/get-summary";
import { useGetDashboardTrends } from "@/lib/api/overview/get-trends";
import { timeAgo } from "@/lib/date";

import Overview from "./components/Overview";

const DEFAULT_TREND_PERIOD: TrendPeriod = "6m";
const DEFAULT_ACTIVITY_LIMIT = 20;

const EMPTY_STATISTIC: Statistic = {
  value: 0,
  growth: 0,
  growthType: "no_change"
};

const toDelta = (growth: number, growthType: GrowthType) => {
  if (growthType === "increase") {
    return `+${growth}%`;
  }

  if (growthType === "decrease") {
    return `-${growth}%`;
  }

  return "--";
};

const toActivityIcon = (type: DashboardRecentActivityItem["type"]): OverviewIconKey => {
  if (type === "ENROLLMENT") {
    return "activity-student";
  }

  if (type === "COMPLETION") {
    return "activity-completion";
  }

  return "activity-quiz";
};

const typeLabel = (type: DashboardRecentActivityItem["type"]) => {
  if (type === "ENROLLMENT") {
    return "Enrollment";
  }

  if (type === "COMPLETION") {
    return "Completion";
  }

  return "Quiz attempt";
};

const mapOverviewData = (
  summaryData: DashboardSummary | undefined,
  trendsData: DashboardTrends | undefined,
  recentActivityData: DashboardRecentActivityItem[]
): OverviewData => {
  const summary = summaryData ?? {
    comparisonPeriod: "month",
    totalStudents: EMPTY_STATISTIC,
    activeStudents: EMPTY_STATISTIC,
    totalCourses: EMPTY_STATISTIC,
    completionRate: EMPTY_STATISTIC
  };

  const trends = trendsData ?? {
    enrollmentTrends: [],
    completionTrends: []
  };

  const deltaLabel = `vs last ${summary.comparisonPeriod}`;

  return {
    heading: {
      title: "Dashboard Overview",
      subtitle: "Key stats, trends, and recent platform activity"
    },
    stats: [
      {
        id: "total-students",
        title: "Total Students",
        value: String(summary.totalStudents.value),
        delta: toDelta(summary.totalStudents.growth, summary.totalStudents.growthType),
        deltaLabel,
        deltaType: summary.totalStudents.growthType,
        icon: "students"
      },
      {
        id: "active-students",
        title: "Active Students",
        value: String(summary.activeStudents.value),
        delta: toDelta(summary.activeStudents.growth, summary.activeStudents.growthType),
        deltaLabel,
        deltaType: summary.activeStudents.growthType,
        icon: "approvals"
      },
      {
        id: "total-courses",
        title: "Total Courses",
        value: String(summary.totalCourses.value),
        delta: toDelta(summary.totalCourses.growth, summary.totalCourses.growthType),
        deltaLabel,
        deltaType: summary.totalCourses.growthType,
        icon: "courses"
      },
      {
        id: "completion-rate",
        title: "Completion Rate",
        value: `${summary.completionRate.value}%`,
        delta: toDelta(summary.completionRate.growth, summary.completionRate.growthType),
        deltaLabel,
        deltaType: summary.completionRate.growthType,
        icon: "completion"
      }
    ],
    enrollmentTrends: trends.enrollmentTrends.map((point) => ({
      label: point.label,
      value: point.count
    })),
    completionTrends: trends.completionTrends.map((point) => ({
      label: point.label,
      value: point.count
    })),
    activities: recentActivityData.map((activity) => ({
      id: activity._id,
      title: activity.title,
      description: typeLabel(activity.type),
      time: timeAgo(activity.timestamp),
      icon: toActivityIcon(activity.type)
    }))
  };
};

export default function OverviewPage() {
  const [period, setPeriod] = useState<TrendPeriod>(DEFAULT_TREND_PERIOD);

  const { data: summaryData, isPending: isSummaryPending } = useGetDashboardSummary();
  const { data: trendsData, isPending: isTrendsPending } = useGetDashboardTrends({ period });
  const { data: recentActivityData, isPending: isRecentActivityPending } =
    useGetDashboardRecentActivity({
      limit: DEFAULT_ACTIVITY_LIMIT
    });

  const overviewData = useMemo(
    () => mapOverviewData(summaryData, trendsData, recentActivityData ?? []),
    [recentActivityData, summaryData, trendsData]
  );

  return (
    <section className="flex flex-col gap-6">
      <Overview
        data={overviewData}
        period={period}
        onPeriodChange={setPeriod}
        isStatsLoading={isSummaryPending}
        isTrendsLoading={isTrendsPending}
        isActivityLoading={isRecentActivityPending}
      />
    </section>
  );
}
