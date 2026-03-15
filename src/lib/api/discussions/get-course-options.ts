"use client";

import { useQuery } from "@tanstack/react-query";

import { get } from "@/lib/api";

import type { DiscussionCourseOptionsResponse } from "@/types";

export const useGetDiscussionCourseOptions = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["community-course-options"],
    enabled,
    queryFn: () => get<DiscussionCourseOptionsResponse>("/courses/options")
  });
};
