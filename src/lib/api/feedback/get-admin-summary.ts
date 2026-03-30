"use client";

import { useQuery } from "@tanstack/react-query";

import { get } from "@/lib/api";

import type { FeedbackAdminSummaryResponse } from "@/types";

export const useGetFeedbackAdminSummary = () => {
  return useQuery({
    queryKey: ["feedback-admin-summary"],
    queryFn: () => get<FeedbackAdminSummaryResponse>("/feedback/admin/summary")
  });
};
