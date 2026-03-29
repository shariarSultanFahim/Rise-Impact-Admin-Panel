"use client";

import { useMutation } from "@tanstack/react-query";

import type { ApiResponseBase, LessonItem } from "@/types/course-editor";

import { api as instance } from "@/lib/api";

interface ReorderLessonsPayload {
  courseId: string;
  moduleId: string;
  lessonOrder: string[];
}

interface ReorderLessonsResponse extends ApiResponseBase {
  data: LessonItem[];
}

export const useReorderLessons = () => {
  return useMutation({
    mutationFn: async ({ courseId, moduleId, lessonOrder }: ReorderLessonsPayload) => {
      const response = await instance.patch<ReorderLessonsResponse>(
        `/courses/${courseId}/modules/${moduleId}/lessons/reorder`,
        { lessonOrder }
      );

      return response.data;
    }
  });
};
