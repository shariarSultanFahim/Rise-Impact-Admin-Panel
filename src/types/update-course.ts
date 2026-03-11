import type { CourseManageStatus } from "./course-manage";

export interface UpdateCoursePayload {
  courseId: string;
  title: string;
  description: string;
  status: CourseManageStatus;
  thumbnail?: File;
}

export interface UpdateCourseResponse {
  success: boolean;
  message: string;
}
