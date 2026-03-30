"use client";

import { useQuery } from "@tanstack/react-query";

import type { GetAllLegalResponse } from "@/types/legal-document";

import { api as instance } from "@/lib/api";

export const useGetAllLegal = () => {
  return useQuery({
    queryKey: ["legal-pages"],
    queryFn: async () => {
      const response = await instance.get<GetAllLegalResponse>("/legal");
      return response.data;
    }
  });
};
