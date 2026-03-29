"use client";

import { useQuery } from "@tanstack/react-query";

import type { CourseOptionsResponse } from "@/types/quiz-builder-manage";

import { get } from "@/lib/api";

export const useGetQuizCourseOptions = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["quiz-builder-course-options"],
    enabled,
    queryFn: () => get<CourseOptionsResponse>("/courses/options")
  });
};
