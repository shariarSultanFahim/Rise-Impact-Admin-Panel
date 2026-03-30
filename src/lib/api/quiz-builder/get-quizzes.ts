"use client";

import { useQuery } from "@tanstack/react-query";

import type { QuizListQueryParams, QuizListResponse } from "@/types/quiz-builder-manage";

import { get } from "@/lib/api";

const buildQuizQueryParams = (params?: QuizListQueryParams): QuizListQueryParams => {
  if (!params) {
    return {};
  }

  const cleanedParams: QuizListQueryParams = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    cleanedParams[key as keyof QuizListQueryParams] = value;
  }

  return cleanedParams;
};

export const useGetQuizzes = (params?: QuizListQueryParams, enabled: boolean = true) => {
  const cleanedParams = buildQuizQueryParams(params);

  return useQuery({
    queryKey: ["quiz-builder-list", cleanedParams],
    enabled,
    queryFn: () =>
      get<QuizListResponse>("/quizzes", {
        params: cleanedParams
      })
  });
};
