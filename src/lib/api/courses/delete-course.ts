"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";

import type { DeleteResponse } from "@/types";

interface DeleteCoursePayload {
  courseId: string;
}

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId }: DeleteCoursePayload) => {
      const response = await instance.delete<DeleteResponse>(`/courses/${courseId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-manage"] });
    }
  });
};
