"use client";

import { useQuery } from "@tanstack/react-query";

import type { AnalyticsCourseCompletionResponse, AnalyticsPeriod } from "@/types/analytics";

import { get } from "@/lib/api";

export const useGetAnalyticsCourseCompletion = (period: AnalyticsPeriod) => {
  return useQuery({
    queryKey: ["analytics-course-completion", period],
    queryFn: () =>
      get<AnalyticsCourseCompletionResponse>("/analytics/course-completion", {
        params: { period }
      })
  });
};
