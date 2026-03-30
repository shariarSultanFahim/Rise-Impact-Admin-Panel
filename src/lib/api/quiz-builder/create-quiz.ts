"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { QuizMutationResponse, QuizWritePayload } from "@/types/quiz-builder-manage";

import { post } from "@/lib/api";

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: QuizWritePayload) =>
      post<QuizMutationResponse, QuizWritePayload>("/quizzes", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-builder-list"] });
    }
  });
};
