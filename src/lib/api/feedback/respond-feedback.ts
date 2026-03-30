"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";

import type { FeedbackRespondPayload, FeedbackRespondResponse } from "@/types";

interface RespondFeedbackMutationPayload {
  feedbackId: string;
  payload: FeedbackRespondPayload;
}

export const useRespondFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ feedbackId, payload }: RespondFeedbackMutationPayload) => {
      const response = await instance.patch<FeedbackRespondResponse>(
        `/feedback/${feedbackId}/respond`,
        payload
      );

      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["feedback-admin-summary"] });
      queryClient.invalidateQueries({ queryKey: ["feedback-admin-list"] });
      queryClient.invalidateQueries({ queryKey: ["feedback-admin-detail", variables.feedbackId] });
    }
  });
};
