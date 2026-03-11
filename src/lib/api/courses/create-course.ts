"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";

import type {
  CreateCoursePayload,
  CreateCourseResponse,
  UpdateCoursePayload,
  UpdateCourseResponse
} from "@/types";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCoursePayload) => {
      const body = new FormData();
      body.append("title", payload.title);
      body.append("description", payload.description);
      body.append("status", payload.status);
      body.append("thumbnail", payload.thumbnail);

      const response = await instance.post<CreateCourseResponse>("/courses", body);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-manage"] });
    }
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseId,
      title,
      description,
      status,
      thumbnail
    }: UpdateCoursePayload) => {
      const body = new FormData();
      body.append("title", title);
      body.append("description", description);
      body.append("status", status);

      if (thumbnail) {
        body.append("thumbnail", thumbnail);
      }

      const response = await instance.patch<UpdateCourseResponse>(`/courses/${courseId}`, body);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-manage"] });
    }
  });
};
