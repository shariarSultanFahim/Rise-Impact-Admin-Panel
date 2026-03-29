"use client";

import { useMutation } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";

import type { CreateLessonResponse, LessonContentType } from "@/types";

export interface LessonMutationPayload {
  title: string;
  type: LessonContentType;
  description: string;
  learningObjectives: string[];
  isVisible: boolean;
  prerequisiteLesson?: string;
  readingContent?: string;
  quiz?: string;
  contentFile?: File;
  attachments?: File[];
}

interface CreateLessonMutationPayload {
  courseId: string;
  moduleId: string;
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

export const useCreateLesson = () => {
  return useMutation({
    mutationFn: async ({ courseId, moduleId, payload }: CreateLessonMutationPayload) => {
      const response = await instance.post<CreateLessonResponse>(
        `/courses/${courseId}/modules/${moduleId}/lessons`,
        buildLessonFormData(payload)
      );

      return response.data;
    }
  });
};
