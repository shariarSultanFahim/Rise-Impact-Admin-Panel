"use client";

import { useQuery } from "@tanstack/react-query";

import type { DetailsLegalResponse } from "@/types/legal-document";

import { api as instance } from "@/lib/api";

export const useGetLegalDetails = (slug?: string) => {
  return useQuery({
    queryKey: ["legal-details", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const response = await instance.get<DetailsLegalResponse>(`/legal/${slug}`);
      return response.data;
    }
  });
};
