"use client";

import { useQuery } from "@tanstack/react-query";

import { get } from "@/lib/api";

import type { CourseOptionsResponse } from "@/types";

export const useGetFeedbackCourseOptions = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["feedback-course-options"],
    enabled,
    queryFn: () => get<CourseOptionsResponse>("/courses/options")
  });
};
