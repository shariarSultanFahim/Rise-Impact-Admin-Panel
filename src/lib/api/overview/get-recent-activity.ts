"use client";

import { useQuery } from "@tanstack/react-query";

import type {
  ActivityType,
  DashboardRecentActivityItem,
  DashboardRecentActivityResponse
} from "@/types/overview";

import { api as instance } from "@/lib/api";

interface RecentActivityQueryParams {
  type?: ActivityType;
  limit?: number;
}

const cleanParams = (params: RecentActivityQueryParams): RecentActivityQueryParams => {
  const cleanedParams: RecentActivityQueryParams = {};

  if (params.type) {
    cleanedParams.type = params.type;
  }

  if (typeof params.limit === "number") {
    cleanedParams.limit = params.limit;
  }

  return cleanedParams;
};

export const useGetDashboardRecentActivity = (params: RecentActivityQueryParams = {}) => {
  return useQuery({
    queryKey: ["dashboard-recent-activity", params],
    queryFn: async (): Promise<DashboardRecentActivityItem[]> => {
      const response = await instance.get<DashboardRecentActivityResponse>(
        "/dashboard/recent-activity",
        {
          params: cleanParams(params)
        }
      );
      return response.data.data;
    }
  });
};
