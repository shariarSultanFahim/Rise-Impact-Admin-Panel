"use client";

import { useQuery } from "@tanstack/react-query";

import type { UserManageDetailsResponse } from "@/types/user-manage-details";

import { api as instance } from "@/lib/api";

export const useGetUserDetails = (id?: string) => {
  return useQuery({
    queryKey: ["user-details", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await instance.get<UserManageDetailsResponse>(`/users/${id}`);
      return response.data;
    }
  });
};
