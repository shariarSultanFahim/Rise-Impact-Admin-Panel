"use client";

import { useMutation } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";

import type { UpdateModulePayload, UpdateModuleResponse } from "@/types";

interface UpdateModuleMutationPayload {
  courseId: string;
  moduleId: string;
  payload: UpdateModulePayload;
}

export const useUpdateModule = () => {
  return useMutation({
    mutationFn: async ({ courseId, moduleId, payload }: UpdateModuleMutationPayload) => {
      const response = await instance.patch<UpdateModuleResponse>(
        `/courses/${courseId}/modules/${moduleId}`,
        payload
      );

      return response.data;
    }
  });
};
