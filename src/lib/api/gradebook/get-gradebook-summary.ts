"use client";

import { useQuery } from "@tanstack/react-query";

import { get } from "@/lib/api";

import type { GradebookAdminSummaryResponse } from "@/types";

export const useGetGradebookSummary = () => {
  return useQuery({
    queryKey: ["gradebook-summary"],
    queryFn: () => get<GradebookAdminSummaryResponse>("/gradebook/students/summary")
  });
};
