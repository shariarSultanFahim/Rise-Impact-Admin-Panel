"use client";

import { useMutation } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";

import type { DeleteResponse } from "@/types";

interface DeleteModulePayload {
  courseId: string;
  moduleId: string;
}

export const useDeleteModule = () => {
  return useMutation({
    mutationFn: async ({ courseId, moduleId }: DeleteModulePayload) => {
      const response = await instance.delete<DeleteResponse>(
        `/courses/${courseId}/modules/${moduleId}`
      );

      return response.data;
    }
  });
};
