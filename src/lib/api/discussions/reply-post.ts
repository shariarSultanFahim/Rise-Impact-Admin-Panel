"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { post } from "@/lib/api";

import type { DiscussionReplyPayload, DiscussionReplyResponse } from "@/types";

export const useReplyToDiscussionPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content, parentReplyId }: DiscussionReplyPayload) => {
      return post<DiscussionReplyResponse, { content: string; parentReplyId?: string }>(
        `/community/posts/${postId}/replies`,
        {
          content,
          parentReplyId
        }
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["community-post", variables.postId] });
    }
  });
};
