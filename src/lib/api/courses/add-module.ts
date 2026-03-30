"use client";

import { useMutation } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";

import type { AddModuleResponse } from "@/types";

interface AddModulePayload {
  courseId: string;
  title: string;
}

export const useAddModule = () => {
  return useMutation({
    mutationFn: async ({ courseId, title }: AddModulePayload) => {
      const response = await instance.post<AddModuleResponse>(`/courses/${courseId}/modules`, {
        title
      });

      return response.data;
    }
  });
};
