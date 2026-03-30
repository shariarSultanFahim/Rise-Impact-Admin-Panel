"use client";

import { useQuery } from "@tanstack/react-query";

import type { GetProfileResponse } from "@/types/user-profile";

import { api as instance } from "@/lib/api";

export const useGetUsersProfile = () => {
  return useQuery({
    queryKey: ["profile-manage"],
    queryFn: async () => {
      const response = await instance.get<GetProfileResponse>("/users/profile");
      return response.data.data;
    }
  });
};
