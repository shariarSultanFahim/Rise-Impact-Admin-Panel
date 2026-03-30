"use client";

import { useQuery } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";

import type { CourseManageQueryParams, CourseManageResponse } from "@/types";

const buildCourseManageParams = (params?: CourseManageQueryParams): CourseManageQueryParams => {
  if (!params) {
    return {};
  }

  const cleanedParams: CourseManageQueryParams = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    cleanedParams[key as keyof CourseManageQueryParams] = value;
  }

  return cleanedParams;
};

export const useGetCourses = (params?: CourseManageQueryParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["courses-manage", params],
    enabled,
    queryFn: async () => {
      const response = await instance.get<CourseManageResponse>("/courses/manage", {
        params: buildCourseManageParams(params)
      });

      return response.data;
    }
  });
};
