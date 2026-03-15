"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { del } from "@/lib/api";

import type { DiscussionDeleteResponse } from "@/types";

interface DeleteDiscussionReplyPayload {
  replyId: string;
  postId: string;
}

export const useDeleteDiscussionReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ replyId }: DeleteDiscussionReplyPayload) => {
      return del<DiscussionDeleteResponse>(`/community/replies/${replyId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["community-post", variables.postId] });
    }
  });
};
