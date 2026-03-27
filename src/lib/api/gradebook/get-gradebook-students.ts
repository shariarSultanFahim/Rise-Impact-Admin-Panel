"use client";

import { useQuery } from "@tanstack/react-query";

import { get } from "@/lib/api";

import type { GradebookAdminListResponse, GradebookAdminQueryParams } from "@/types";

const buildGradebookQueryParams = (
  params?: GradebookAdminQueryParams
): GradebookAdminQueryParams => {
  if (!params) {
    return {};
  }

  const cleanedParams: GradebookAdminQueryParams = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    cleanedParams[key as keyof GradebookAdminQueryParams] = value;
  }

  return cleanedParams;
};

export const useGetGradebookStudents = (
  params?: GradebookAdminQueryParams,
  enabled: boolean = true
) => {
  const cleanedParams = buildGradebookQueryParams(params);

  return useQuery({
    queryKey: ["gradebook-students", cleanedParams],
    enabled,
    queryFn: () =>
      get<GradebookAdminListResponse>("/gradebook/students", {
        params: cleanedParams
      })
  });
};
