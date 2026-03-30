"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { del } from "@/lib/api";

import type { DiscussionDeleteResponse } from "@/types";

interface DeleteDiscussionPostPayload {
  postId: string;
}

export const useDeleteDiscussionPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: DeleteDiscussionPostPayload) => {
      return del<DiscussionDeleteResponse>(`/community/posts/${postId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["community-post", variables.postId] });
    }
  });
};
