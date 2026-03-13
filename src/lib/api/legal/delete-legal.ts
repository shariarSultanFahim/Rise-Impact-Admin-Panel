"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DeleteLegalResponse } from "@/types/legal-document";

import { api as instance } from "@/lib/api";

export const useDeleteLegal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const response = await instance.delete<DeleteLegalResponse>(`/legal/${slug}`);
      return response.data;
    },
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: ["legal-pages"] });
      queryClient.removeQueries({ queryKey: ["legal-details", slug] });
    }
  });
};
