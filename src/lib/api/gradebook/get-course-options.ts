"use client";

import { useQuery } from "@tanstack/react-query";

import { get } from "@/lib/api";

import type { CourseOptionsResponse } from "@/types";

export const useGetGradebookCourseOptions = () => {
  return useQuery({
    queryKey: ["gradebook-course-options"],
    queryFn: () => get<CourseOptionsResponse>("/courses/options")
  });
};
