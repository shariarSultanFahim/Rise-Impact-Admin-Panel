"use client";

import { useQuery } from "@tanstack/react-query";

import type { AnalyticsPeriod, AnalyticsQuizPerformanceResponse } from "@/types/analytics";

import { get } from "@/lib/api";

interface AnalyticsCourseQuizParams {
  courseId?: string;
  period: AnalyticsPeriod;
  page?: number;
  limit?: number;
}

export const useGetAnalyticsCourseQuizzes = ({
  courseId,
  period,
  page = 1,
  limit = 10
}: AnalyticsCourseQuizParams) => {
  return useQuery({
    queryKey: ["analytics-course-quizzes", courseId, period, page, limit],
    enabled: Boolean(courseId),
    queryFn: () =>
      get<AnalyticsQuizPerformanceResponse>(`/analytics/courses/${courseId}/quizzes`, {
        params: { period, page, limit }
      })
  });
};
