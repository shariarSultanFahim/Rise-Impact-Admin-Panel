"use client";

import { useQuery } from "@tanstack/react-query";

import type { DashboardTrendsResponse, TrendPeriod } from "@/types/overview";

import { api as instance } from "@/lib/api";

interface TrendsQueryParams {
  period: TrendPeriod;
}

const PERIOD_TO_MONTHS: Record<TrendPeriod, number | undefined> = {
  "7d": undefined,
  "30d": undefined,
  "3m": 3,
  "6m": 6,
  "12m": 12
};

export const useGetDashboardTrends = ({ period }: TrendsQueryParams) => {
  return useQuery({
    queryKey: ["dashboard-trends", period],
    queryFn: async () => {
      const months = PERIOD_TO_MONTHS[period];
      const response = await instance.get<DashboardTrendsResponse>("/dashboard/trends", {
        params: {
          period,
          ...(months ? { months } : {})
        }
      });
      return response.data.data;
    }
  });
};
