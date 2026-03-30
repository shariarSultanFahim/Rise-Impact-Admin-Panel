"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { DeleteQuizResponse } from "@/types/quiz-builder-manage";

import { del } from "@/lib/api";

interface DeleteQuizPayload {
  quizId: string;
}

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId }: DeleteQuizPayload) => del<DeleteQuizResponse>(`/quizzes/${quizId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-builder-list"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-builder-details"] });
    }
  });
};
