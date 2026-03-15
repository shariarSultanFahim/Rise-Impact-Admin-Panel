"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";

import type { DiscussionReplyUpdatePayload, DiscussionReplyUpdateResponse } from "@/types";

export const useEditDiscussionReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ replyId, content }: DiscussionReplyUpdatePayload) => {
      const response = await instance.patch<DiscussionReplyUpdateResponse>(
        `/community/replies/${replyId}`,
        {
          content
        }
      );

      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["community-post", variables.postId] });
    }
  });
};
