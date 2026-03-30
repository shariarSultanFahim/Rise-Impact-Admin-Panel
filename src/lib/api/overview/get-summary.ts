"use client";

import { useQuery } from "@tanstack/react-query";

import type { DashboardSummaryResponse } from "@/types/overview";

import { api as instance } from "@/lib/api";

export const useGetDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const response = await instance.get<DashboardSummaryResponse>("/dashboard/summary");
      return response.data.data;
    }
  });
};
