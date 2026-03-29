"use client";

import { useQuery } from "@tanstack/react-query";

import type { AnalyticsEngagementHeatmapResponse, AnalyticsPeriod } from "@/types/analytics";

import { get } from "@/lib/api";

export const useGetAnalyticsEngagementHeatmap = (period: AnalyticsPeriod) => {
  return useQuery({
    queryKey: ["analytics-engagement-heatmap", period],
    queryFn: () =>
      get<AnalyticsEngagementHeatmapResponse>("/analytics/engagement-heatmap", {
        params: { period }
      })
  });
};
