"use client";

import { useQuery } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";

import type { GetLessonByIdResponse } from "@/types";

interface GetLessonByIdParams {
  courseId?: string;
  lessonId?: string;
}

export const useGetLessonById = ({ courseId, lessonId }: GetLessonByIdParams) => {
  return useQuery({
    queryKey: ["lesson-details", courseId, lessonId],
    enabled: Boolean(courseId && lessonId),
    queryFn: async () => {
      const response = await instance.get<GetLessonByIdResponse>(
        `/courses/${courseId}/lessons/${lessonId}`
      );

      return response.data;
    }
  });
};
