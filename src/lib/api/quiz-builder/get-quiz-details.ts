"use client";

import { useQuery } from "@tanstack/react-query";

import type { QuizDetailResponse } from "@/types/quiz-builder-manage";

import { get } from "@/lib/api";

export const useGetQuizDetails = (quizId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["quiz-builder-details", quizId],
    enabled: Boolean(quizId) && enabled,
    queryFn: () => get<QuizDetailResponse>(`/quizzes/${quizId}`)
  });
};
