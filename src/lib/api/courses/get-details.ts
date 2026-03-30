"use client";

import { useQuery } from "@tanstack/react-query";

import type { CourseManageItem } from "@/types/course-manage";

import { api as instance } from "@/lib/api";

export interface CourseDetailsResponse {
  success: boolean;
  message: string;
  data: CourseManageItem;
}

export const useGetCourseDetails = (slug?: string) => {
  return useQuery({
    queryKey: ["course-details", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const response = await instance.get<CourseDetailsResponse>(`/courses/${slug}`);
      return response.data;
    }
  });
};
