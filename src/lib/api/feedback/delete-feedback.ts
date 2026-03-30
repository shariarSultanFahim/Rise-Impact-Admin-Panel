"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { del } from "@/lib/api";

import type { FeedbackDeleteResponse } from "@/types";

interface DeleteFeedbackMutationPayload {
  feedbackId: string;
}

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ feedbackId }: DeleteFeedbackMutationPayload) => {
      return del<FeedbackDeleteResponse>(`/feedback/${feedbackId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["feedback-admin-summary"] });
      queryClient.invalidateQueries({ queryKey: ["feedback-admin-list"] });
      queryClient.removeQueries({ queryKey: ["feedback-admin-detail", variables.feedbackId] });
    }
  });
};
