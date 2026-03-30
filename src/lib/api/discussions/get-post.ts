"use client";

import { useQuery } from "@tanstack/react-query";

import { get } from "@/lib/api";

import type { DiscussionPostDetailResponse } from "@/types";

export const useGetDiscussionPost = (postId?: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["community-post", postId],
    enabled: enabled && Boolean(postId),
    queryFn: () => get<DiscussionPostDetailResponse>(`/community/posts/${postId}`)
  });
};
