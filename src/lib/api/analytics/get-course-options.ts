"use client";

import { useQuery } from "@tanstack/react-query";

import type { AnalyticsCourseOptionsResponse } from "@/types/analytics";

import { get } from "@/lib/api";

export const useGetAnalyticsCourseOptions = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["analytics-course-options"],
    enabled,
    queryFn: () => get<AnalyticsCourseOptionsResponse>("/courses/options")
  });
};
