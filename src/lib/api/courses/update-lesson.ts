"use client";

import { useMutation } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";

import type { UpdateLessonResponse } from "@/types";

import type { LessonMutationPayload } from "./create-lesson";

interface UpdateLessonMutationPayload {
  courseId: string;
  moduleId: string;
  lessonId: string;
  payload: LessonMutationPayload;
}

const buildLessonFormData = (payload: LessonMutationPayload) => {
  const body = new FormData();
  body.append("title", payload.title);
  body.append("type", payload.type);
  body.append("description", payload.description);
  payload.learningObjectives.forEach((objective) => {
    body.append("learningObjectives[]", objective);
  });
  body.append("isVisible", String(payload.isVisible));

  if (payload.prerequisiteLesson) {
    body.append("prerequisiteLesson", payload.prerequisiteLesson);
  }

  if (payload.readingContent) {
    body.append("readingContent", payload.readingContent);
  }

  if (payload.quiz) {
    body.append("quiz", payload.quiz);
  }

  if (payload.contentFile) {
    body.append("contentFile", payload.contentFile);
  }

  payload.attachments?.forEach((file) => {
    body.append("attachments", file);
  });

  return body;
};

export const useUpdateLesson = () => {
  return useMutation({
    mutationFn: async ({ courseId, moduleId, lessonId, payload }: UpdateLessonMutationPayload) => {
      const response = await instance.patch<UpdateLessonResponse>(
        `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        buildLessonFormData(payload)
      );

      return response.data;
    }
  });
};
