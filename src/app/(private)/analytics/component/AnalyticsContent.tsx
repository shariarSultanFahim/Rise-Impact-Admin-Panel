"use client";

import { ArrowDownRight, ArrowUpRight, FileDownIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import type { AnalyticsData } from "@/types/analytics";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { analyticsFilterSchema, type AnalyticsFilterFormData } from "../schema/analytics.schema";
import CompletionTrendsChart from "./charts/CompletionTrendsChart";
import EngagementHeatmapChart from "./charts/EngagementHeatmapChart";
import QuizScoreChart from "./charts/QuizScoreChart";
import TopCoursesChart from "./charts/TopCoursesChart";
import UserGrowthChart from "./charts/UserGrowthChart";

type AnalyticsContentProps = {
  data: AnalyticsData;
};

export default function AnalyticsContent({ data }: AnalyticsContentProps) {
  const form = useForm<AnalyticsFilterFormData>({
    resolver: zodResolver(analyticsFilterSchema),
    defaultValues: {
      dateRange: data.filters.dateRanges[0] ?? "",
      course: data.filters.courses[0] ?? ""
    }
  });

  const selectedCourse = useWatch({
    control: form.control,
    name: "course"
  });

  const handleExport = async (format: "pdf" | "excel") => {
    try {
      // TODO: Replace with analytics export API call.
      await Promise.resolve(format);
      toast.success(`Export started (${format.toUpperCase()}).`);
    } catch {
      toast.error("Unable to export right now. Try again.");
    }
  };

  const showTopCourses = selectedCourse === data.filters.courses[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{data.heading.title}</h1>
        <p className="text-muted-foreground">{data.heading.subtitle}</p>
      </div>

      <Card>
        <CardContent className="flex flex-col justify-between gap-4 py-6 sm:flex-row sm:items-end">
          <Form {...form}>
            <form className="flex flex-1 flex-col gap-3 sm:flex-row">
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="min-w-[180px] flex-1">
                    <FormLabel>Date Range</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          {data.filters.dateRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem className="min-w-[200px] flex-1">
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {data.filters.courses.map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport("pdf")}
              className="gap-2"
            >
              <FileDownIcon className="size-4" />
              Export PDF
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport("excel")}
              className="gap-2"
            >
              <FileDownIcon className="size-4" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => {
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
                      isPositive ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
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
            <CardDescription>Weekly completion across active courses.</CardDescription>
          </CardHeader>
          <CompletionTrendsChart data={data.completionTrends} />
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Quiz Score Distribution</CardTitle>
            <CardDescription>Breakdown of student score ranges.</CardDescription>
          </CardHeader>
          <QuizScoreChart data={data.quizScoreDistribution} />
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">User Growth Over Time</CardTitle>
            <CardDescription>Monthly student registrations.</CardDescription>
          </CardHeader>
          <UserGrowthChart data={data.userGrowth} />
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Engagement Heatmap</CardTitle>
            <CardDescription>Daily engagement intensity by weekday.</CardDescription>
          </CardHeader>
          <EngagementHeatmapChart data={data.engagementHeatmap} />
        </Card>
      </div>

      {showTopCourses ? (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top Performing Courses</CardTitle>
            <CardDescription>Completion performance across all courses.</CardDescription>
          </CardHeader>
          <TopCoursesChart data={data.topCourses} />
        </Card>
      ) : null}
    </div>
  );
}
