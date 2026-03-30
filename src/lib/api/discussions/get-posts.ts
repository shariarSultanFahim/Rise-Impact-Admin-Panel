"use client";

import { useQuery } from "@tanstack/react-query";

import { get } from "@/lib/api";

import type { DiscussionPostsResponse, DiscussionQueryParams } from "@/types";

const buildDiscussionParams = (params?: DiscussionQueryParams): DiscussionQueryParams => {
  if (!params) {
    return {};
  }

  const cleanedParams: DiscussionQueryParams = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    cleanedParams[key as keyof DiscussionQueryParams] = value;
  }

  return cleanedParams;
};

export const useGetDiscussionPosts = (params?: DiscussionQueryParams, enabled: boolean = true) => {
  const cleanedParams = buildDiscussionParams(params);

  return useQuery({
    queryKey: ["community-posts", cleanedParams],
    enabled,
    queryFn: () =>
      get<DiscussionPostsResponse>("/community/posts", {
        params: cleanedParams
      })
  });
};
