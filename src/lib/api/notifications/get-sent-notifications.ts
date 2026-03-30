"use client";

import { useQuery } from "@tanstack/react-query";

import { get } from "@/lib/api";

import type { NotificationQueryParams, SentNotificationHistoryResponse } from "@/types";

const buildNotificationQueryParams = (
  params?: NotificationQueryParams
): NotificationQueryParams => {
  if (!params) {
    return {};
  }

  const cleanedParams: NotificationQueryParams = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    cleanedParams[key as keyof NotificationQueryParams] = value;
  }

  return cleanedParams;
};

export const useGetSentNotifications = (
  params?: NotificationQueryParams,
  enabled: boolean = true
) => {
  const cleanedParams = buildNotificationQueryParams(params);

  return useQuery({
    queryKey: ["sent-notifications", cleanedParams],
    enabled,
    queryFn: () =>
      get<SentNotificationHistoryResponse>("/notifications/admin/sent", {
        params: cleanedParams
      })
  });
};
