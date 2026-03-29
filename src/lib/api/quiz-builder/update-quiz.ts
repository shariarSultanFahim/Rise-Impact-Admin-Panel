"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { QuizMutationResponse, QuizWritePayload } from "@/types/quiz-builder-manage";

import { api as instance } from "@/lib/api";

interface UpdateQuizPayload {
  quizId: string;
  payload: QuizWritePayload;
}

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quizId, payload }: UpdateQuizPayload) => {
      const response = await instance.patch<QuizMutationResponse>(`/quizzes/${quizId}`, payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quiz-builder-list"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-builder-details", variables.quizId] });
    }
  });
};
