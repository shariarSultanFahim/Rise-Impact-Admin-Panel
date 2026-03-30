"use client";

import { useQuery } from "@tanstack/react-query";

import { UserManageQueryParams, UserManageResponse } from "@/types/users-manage";

import { api as instance } from "@/lib/api";

const buildUserParams = (params?: UserManageQueryParams): UserManageQueryParams => {
  if (!params) {
    return {};
  }

  const cleanedParams: UserManageQueryParams = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    cleanedParams[key as keyof UserManageQueryParams] = value;
  }

  return cleanedParams;
};

export const useGetUsers = (params?: UserManageQueryParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["users-manage", params],
    enabled,
    queryFn: async () => {
      const response = await instance.get<UserManageResponse>("/users", {
        params: buildUserParams(params)
      });

      return response.data;
    }
  });
};
