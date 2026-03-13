"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateLegalPayload, CreateLegalResponse } from "@/types/legal-document";

import { api as instance } from "@/lib/api";

export const useCreateLegal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateLegalPayload) => {
      const response = await instance.post<CreateLegalResponse>("/legal", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legal-pages"] });
    }
  });
};
