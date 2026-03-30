"use client";

import { useQuery } from "@tanstack/react-query";

import { get } from "@/lib/api";

import type { GamificationLeaderboardQueryParams, GamificationLeaderboardResponse } from "@/types";

const buildLeaderboardParams = (
  params?: GamificationLeaderboardQueryParams
): GamificationLeaderboardQueryParams => {
  if (!params) {
    return {};
  }

  const cleanedParams: GamificationLeaderboardQueryParams = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    cleanedParams[key as keyof GamificationLeaderboardQueryParams] = value;
  }

  return cleanedParams;
};

export const useGetGamificationLeaderboard = (
  params?: GamificationLeaderboardQueryParams,
  enabled: boolean = true
) => {
  const cleanedParams = buildLeaderboardParams(params);

  return useQuery({
    queryKey: ["gamification-leaderboard", cleanedParams],
    enabled,
    queryFn: () =>
      get<GamificationLeaderboardResponse>("/gamification/leaderboard", {
        params: cleanedParams
      })
  });
};
