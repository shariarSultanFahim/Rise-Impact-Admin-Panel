"use client";

import { useMemo, useState } from "react";

import { ArrowDownRight, ArrowUpRight, FileDownIcon } from "lucide-react";
import { toast } from "sonner";

import type {
  AnalyticsDateRange,
  AnalyticsHeatmapDay,
  AnalyticsPeriod,
  AnalyticsTopCourse
} from "@/types/analytics";

import { useExportAnalytics } from "@/lib/api/analytics/export-analytics";
import { useGetAnalyticsCourseCompletion } from "@/lib/api/analytics/get-course-completion";
import { useGetAnalyticsCourseOptions } from "@/lib/api/analytics/get-course-options";
import { useGetAnalyticsCourseQuizzes } from "@/lib/api/analytics/get-course-quizzes";
import { useGetAnalyticsDashboardTrends } from "@/lib/api/analytics/get-dashboard-trends";
import { useGetAnalyticsEngagementHeatmap } from "@/lib/api/analytics/get-engagement-heatmap";
import { useGetDashboardSummary } from "@/lib/api/overview/get-summary";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { AnalyticsContentSkeleton, AnalyticsFilterSkeleton } from "./AnalyticsSkeleton";
import CompletionTrendsChart from "./charts/CompletionTrendsChart";
import EngagementHeatmapChart from "./charts/EngagementHeatmapChart";
import QuizPerformanceTable from "./charts/QuizPerformanceTable";
import TopCoursesChart from "./charts/TopCoursesChart";
import UserGrowthChart from "./charts/UserGrowthChart";

const DATE_RANGES: Array<{ value: AnalyticsDateRange; label: string }> = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "3m", label: "Last 3 Months" },
  { value: "6m", label: "Last 6 Months" },
  { value: "12m", label: "Last 12 Months" }
];

const RANGE_PERIOD_MAP: Record<AnalyticsDateRange, AnalyticsPeriod> = {
  "7d": "week",
  "30d": "month",
  "3m": "quarter",
  "6m": "year",
  "12m": "year"
};

const RANGE_MONTHS_MAP: Record<AnalyticsDateRange, number> = {
  "7d": 1,
  "30d": 1,
  "3m": 3,
  "6m": 6,
  "12m": 12
};

const RANGE_HEATMAP_PERIOD_MAP: Record<AnalyticsDateRange, AnalyticsPeriod> = {
  "7d": "month",
  "30d": "month",
  "3m": "quarter",
  "6m": "quarter",
  "12m": "year"
};

const formatGrowth = (growth: number, isIncrease: boolean): string => {
  const sign = isIncrease ? "+" : "-";
  return `${sign}${growth}%`;
};

const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");

  downloadLink.href = url;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(url);
};

const mapHeatmap = (data: Array<{ date: string; intensity: number }>): AnalyticsHeatmapDay[] => {
  const days: AnalyticsHeatmapDay[] = [
    { day: "Mon", values: [] },
    { day: "Tue", values: [] },
    { day: "Wed", values: [] },
    { day: "Thu", values: [] },
    { day: "Fri", values: [] },
    { day: "Sat", values: [] },
    { day: "Sun", values: [] }
  ];

  for (const item of data) {
    const date = new Date(item.date);
    const dayIndex = (date.getUTCDay() + 6) % 7;
    days[dayIndex].values.push(item.intensity);
  }

  return days.map((row) => ({
    ...row,
    values: row.values.slice(0, 14)
  }));
};

export default function AnalyticsContent() {
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>("6m");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all-courses");

  const period = RANGE_PERIOD_MAP[dateRange];
  const heatmapPeriod = RANGE_HEATMAP_PERIOD_MAP[dateRange];
  const months = RANGE_MONTHS_MAP[dateRange];

  const {
    data: summaryData,
    isPending: isSummaryPending,
    isFetching: isSummaryFetching
  } = useGetDashboardSummary();
  const {
    data: trendsData,
    isPending: isTrendsPending,
    isFetching: isTrendsFetching
  } = useGetAnalyticsDashboardTrends(months);
  const {
    data: completionData,
    isPending: isCompletionPending,
    isFetching: isCompletionFetching
  } = useGetAnalyticsCourseCompletion(period);
  const {
    data: heatmapData,
    isPending: isHeatmapPending,
    isFetching: isHeatmapFetching
  } = useGetAnalyticsEngagementHeatmap(heatmapPeriod);
  const {
    data: courseOptionsData,
    isPending: isCourseOptionsPending,
    isFetching: isCourseOptionsFetching
  } = useGetAnalyticsCourseOptions();
  const {
    data: quizData,
    isPending: isQuizPending,
    isFetching: isQuizFetching
  } = useGetAnalyticsCourseQuizzes({
    courseId: selectedCourseId !== "all-courses" ? selectedCourseId : undefined,
    period,
    page: 1,
    limit: 10
  });

  const { mutateAsync: exportAnalytics, isPending: isExporting } = useExportAnalytics();

  const selectedCourse = useMemo(() => {
    return courseOptionsData?.data.find((course) => course._id === selectedCourseId);
  }, [courseOptionsData?.data, selectedCourseId]);

  const topCourses = useMemo<AnalyticsTopCourse[]>(() => {
    return (completionData?.data ?? []).map((course) => ({
      id: course.courseId,
      title: course.title,
      students: course.totalEnrollments,
      completion: course.completionRate
    }));
  }, [completionData?.data]);

  const completionTrends = useMemo(() => {
    return (trendsData?.completionTrends ?? []).map((point) => ({
      label: point.label,
      value: point.count
    }));
  }, [trendsData?.completionTrends]);

  const enrollmentTrends = useMemo(() => {
    return (trendsData?.enrollmentTrends ?? []).map((point) => ({
      label: point.label,
      value: point.count
    }));
  }, [trendsData?.enrollmentTrends]);

  const heatmapRows = useMemo(
    () =>
      mapHeatmap(
        (heatmapData?.data ?? []).map((item) => ({
          date: item.date,
          intensity: item.intensity
        }))
      ),
    [heatmapData?.data]
  );

  const isPrimaryContentPending =
    isSummaryPending || isTrendsPending || isCompletionPending || isHeatmapPending;

  const isPrimaryContentRefetching =
    !isPrimaryContentPending &&
    (isSummaryFetching ||
      isTrendsFetching ||
      isCompletionFetching ||
      isHeatmapFetching ||
      (selectedCourseId !== "all-courses" && (isQuizPending || isQuizFetching)));

  const handleExport = async (format: "csv" | "xlsx") => {
    try {
      const result = await exportAnalytics({
        type: selectedCourseId === "all-courses" ? "courses" : "quizzes",
        format,
        period,
        course: selectedCourseId === "all-courses" ? undefined : selectedCourseId
      });

      downloadBlob(result.blob, result.fileName);
      toast.success(`Export started (${format.toUpperCase()}).`);
    } catch {
      toast.error("Unable to export right now. Try again.");
    }
  };

  const stats = [
    {
      id: "total-students",
      title: "Total Students",
      value: String(summaryData?.totalStudents.value ?? 0),
      delta: formatGrowth(
        summaryData?.totalStudents.growth ?? 0,
        summaryData?.totalStudents.growthType !== "decrease"
      ),
      deltaLabel: `vs last ${summaryData?.comparisonPeriod ?? "month"}`,
      trend: summaryData?.totalStudents.growthType === "decrease" ? "down" : "up"
    },
    {
      id: "avg-completion",
      title: "Avg Completion Rate",
      value: `${summaryData?.completionRate.value ?? 0}%`,
      delta: formatGrowth(
        summaryData?.completionRate.growth ?? 0,
        summaryData?.completionRate.growthType !== "decrease"
      ),
      deltaLabel: `vs last ${summaryData?.comparisonPeriod ?? "month"}`,
      trend: summaryData?.completionRate.growthType === "decrease" ? "down" : "up"
    }
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics & Reports</h1>
        <p className="text-muted-foreground">Track platform trends, engagement and outcomes.</p>
      </div>

      {isCourseOptionsPending ? (
        <AnalyticsFilterSkeleton />
      ) : (
        <Card>
          <CardContent className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="min-w-[180px] flex-1 space-y-2">
                <p className="text-sm font-medium">Date Range</p>
                <Select
                  value={dateRange}
                  onValueChange={(value: AnalyticsDateRange) => setDateRange(value)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[200px] flex-1 space-y-2">
                <p className="text-sm font-medium">Course</p>
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-courses">All Courses</SelectItem>
                    {(courseOptionsData?.data ?? []).map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleExport("csv")}
                className="gap-2"
                disabled={isExporting}
              >
                <FileDownIcon className="size-4" />
                Export CSV
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleExport("xlsx")}
                className="gap-2"
                disabled={isExporting}
              >
                <FileDownIcon className="size-4" />
                Export XLSX
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isPrimaryContentPending || isPrimaryContentRefetching ? <AnalyticsContentSkeleton /> : null}

      {!isPrimaryContentPending ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            {stats.map((stat) => {
              const isPositive = stat.trend === "up";
              const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

              return (
                <Card key={stat.id} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <CardAction>
                      <div
                        className={`rounded-full p-1.5 ${
                          isPositive
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-rose-100 text-rose-600"
                        }`}
                      >
                        <TrendIcon className="h-4 w-4" />
                      </div>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
                    <div className={`text-xs ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                      {stat.delta} {stat.deltaLabel}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Course Completion Trends</CardTitle>
                <CardDescription>Monthly completed enrollments over time.</CardDescription>
              </CardHeader>
              <CompletionTrendsChart data={completionTrends} />
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Enrollment Trends</CardTitle>
                <CardDescription>Monthly new enrollments over time.</CardDescription>
              </CardHeader>
              <UserGrowthChart data={enrollmentTrends} />
            </Card>

            <Card className="shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Engagement Heatmap</CardTitle>
                <CardDescription>
                  Daily active learner intensity for the selected period.
                </CardDescription>
              </CardHeader>
              <EngagementHeatmapChart data={heatmapRows} />
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Top Performing Courses</CardTitle>
              <CardDescription>Completion performance across all courses.</CardDescription>
            </CardHeader>
            <TopCoursesChart data={topCourses} />
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Quiz Performance</CardTitle>
              <CardDescription>
                Quiz attempts and score quality for the selected course.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizPerformanceTable
                courseTitle={selectedCourse?.title}
                hasSelection={selectedCourseId !== "all-courses"}
                data={quizData?.data ?? []}
              />
            </CardContent>
          </Card>
        </>
      ) : null}

      {isCourseOptionsFetching && !isCourseOptionsPending ? (
        <p className="text-xs text-muted-foreground">Refreshing filters...</p>
      ) : null}
    </div>
  );
}
