"use client";

import { useQuery } from "@tanstack/react-query";

import type { DashboardTrendsResponse } from "@/types/overview";

import { get } from "@/lib/api";

export const useGetAnalyticsDashboardTrends = (months: number) => {
  return useQuery({
    queryKey: ["analytics-dashboard-trends", months],
    queryFn: async () => {
      const response = await get<DashboardTrendsResponse>("/dashboard/trends", {
        params: { months }
      });

      return response.data;
    }
  });
};
