"use client";

import { useMutation } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";

import type { CreateCoursePayload, CreateCourseResponse } from "@/types";

export const useCreateCourse = () => {
  return useMutation({
    mutationFn: async (payload: CreateCoursePayload) => {
      const body = new FormData();
      body.append("title", payload.title);
      body.append("description", payload.description);
      body.append("status", payload.status);
      body.append("thumbnail", payload.thumbnail);

      const response = await instance.post<CreateCourseResponse>("/courses", body);
      return response.data;
    }
  });
};
