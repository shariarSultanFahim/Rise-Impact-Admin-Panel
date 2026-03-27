"use client";

import { useQuery } from "@tanstack/react-query";

import { get } from "@/lib/api";

import type { FeedbackAdminListResponse, FeedbackAdminQueryParams } from "@/types";

const buildFeedbackQueryParams = (params?: FeedbackAdminQueryParams): FeedbackAdminQueryParams => {
  if (!params) {
    return {};
  }

  const cleanedParams: FeedbackAdminQueryParams = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    cleanedParams[key as keyof FeedbackAdminQueryParams] = value;
  }

  return cleanedParams;
};

export const useGetAdminFeedbacks = (
  params?: FeedbackAdminQueryParams,
  enabled: boolean = true
) => {
  const cleanedParams = buildFeedbackQueryParams(params);

  return useQuery({
    queryKey: ["feedback-admin-list", cleanedParams],
    enabled,
    queryFn: () =>
      get<FeedbackAdminListResponse>("/feedback/admin/all", {
        params: cleanedParams
      })
  });
};
