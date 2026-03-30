"use client";

import { useMutation } from "@tanstack/react-query";

import type { ApiResponseBase, CourseModule } from "@/types/course-editor";

import { api as instance } from "@/lib/api";

interface ReorderModulesPayload {
  courseId: string;
  moduleOrder: string[];
}

interface ReorderModulesResponse extends ApiResponseBase {
  data: CourseModule[];
}

export const useReorderModules = () => {
  return useMutation({
    mutationFn: async ({ courseId, moduleOrder }: ReorderModulesPayload) => {
      const response = await instance.patch<ReorderModulesResponse>(
        `/courses/${courseId}/modules/reorder`,
        { moduleOrder }
      );

      return response.data;
    }
  });
};
