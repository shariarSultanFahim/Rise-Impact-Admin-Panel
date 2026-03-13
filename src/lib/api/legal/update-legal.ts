"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateLegalPayload, UpdateLegalResponse } from "@/types/legal-document";

import { api as instance } from "@/lib/api";

export const useUpdateLegal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, ...body }: UpdateLegalPayload) => {
      const response = await instance.patch<UpdateLegalResponse>(`/legal/${slug}`, body);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["legal-pages"] });
      queryClient.invalidateQueries({ queryKey: ["legal-details", variables.slug] });
    }
  });
};
