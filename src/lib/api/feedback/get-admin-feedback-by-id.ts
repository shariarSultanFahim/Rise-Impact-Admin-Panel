"use client";

import { useQuery } from "@tanstack/react-query";

import { get } from "@/lib/api";

import type { FeedbackAdminDetailResponse } from "@/types";

export const useGetAdminFeedbackById = (feedbackId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["feedback-admin-detail", feedbackId],
    enabled: Boolean(feedbackId) && enabled,
    queryFn: () => get<FeedbackAdminDetailResponse>(`/feedback/admin/${feedbackId}`)
  });
};
