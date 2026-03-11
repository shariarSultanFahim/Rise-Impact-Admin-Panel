"use client";

import { useMutation } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";

import type { DeleteResponse } from "@/types";

interface DeleteLessonPayload {
  courseId: string;
  moduleId: string;
  lessonId: string;
}

export const useDeleteLesson = () => {
  return useMutation({
    mutationFn: async ({ courseId, moduleId, lessonId }: DeleteLessonPayload) => {
      const response = await instance.delete<DeleteResponse>(
        `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`
      );

      return response.data;
    }
  });
};
