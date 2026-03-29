"use client";

import { useQuery } from "@tanstack/react-query";

import { get } from "@/lib/api";

import type { GamificationBadgeListResponse, GamificationBadgeQueryParams } from "@/types";

const buildBadgeParams = (params?: GamificationBadgeQueryParams): GamificationBadgeQueryParams => {
  if (!params) {
    return {};
  }

  const cleanedParams: GamificationBadgeQueryParams = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    cleanedParams[key as keyof GamificationBadgeQueryParams] = value;
  }

  return cleanedParams;
};

export const useGetGamificationBadges = (
  params?: GamificationBadgeQueryParams,
  enabled: boolean = true
) => {
  const cleanedParams = buildBadgeParams(params);

  return useQuery({
    queryKey: ["gamification-badges", cleanedParams],
    enabled,
    queryFn: () =>
      get<GamificationBadgeListResponse>("/gamification/badges", {
        params: cleanedParams
      })
  });
};
