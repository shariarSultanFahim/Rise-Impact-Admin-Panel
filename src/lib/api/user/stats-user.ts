"use client";

import { useQuery } from "@tanstack/react-query";

import type { UsersStatsResponse } from "@/types/users-stats";

import { api as instance } from "@/lib/api";

export const useGetUsersStats = () => {
  return useQuery({
    queryKey: ["users-stats"],
    queryFn: async () => {
      const response = await instance.get<UsersStatsResponse>("/users/stats");
      return response.data;
    }
  });
};
