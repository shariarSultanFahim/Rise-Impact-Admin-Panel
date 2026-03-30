"use client";

import { useParams } from "next/navigation";

import type { CourseStatus, LessonForm, ModuleForm } from "@/types/course-form";

import { useGetCourseDetails } from "@/lib/api/courses/get-details";

import CreateCourse from "../../create/component/CreateCourse";

const normalizeLessonType = (type?: string): LessonForm["type"] => {
  if (type === "READING" || type === "reading") {
    return "reading";
  }

  if (type === "QUIZ" || type === "quiz") {
    return "quiz";
  }

  return "video";
};

const normalizeQuizId = (quiz: unknown): string => {
  if (!quiz) {
    return "";
  }

  if (typeof quiz === "string") {
    return quiz;
  }

  if (typeof quiz === "object" && quiz !== null && "_id" in quiz) {
    return String((quiz as Record<string, unknown>)._id ?? "");
  }

  return "";
};

const normalizeResourceLink = (resource: unknown): string => {
  if (!resource) {
    return "";
  }

  if (typeof resource === "string") {
    return resource;
  }

  if (typeof resource === "object" && resource !== null) {
    const resourceRecord = resource as Record<string, unknown>;
    const possibleKeys = ["url", "secure_url", "location", "path", "href", "fileUrl"];

    for (const key of possibleKeys) {
      const value = resourceRecord[key];
      if (typeof value === "string" && value.trim()) {
        return value;
      }
    }
  }

  return "";
};

const normalizeAttachments = (attachments: unknown): LessonForm["attachments"] => {
  if (!Array.isArray(attachments)) {
    return [];
  }

  return attachments
    .map((attachment) => {
      if (typeof attachment === "string") {
        return attachment;
      }

      if (typeof attachment === "object" && attachment !== null) {
        const attachmentRecord = attachment as Record<string, unknown>;
        return {
          url: typeof attachmentRecord.url === "string" ? attachmentRecord.url : undefined,
          name: typeof attachmentRecord.name === "string" ? attachmentRecord.name : undefined
        };
      }

      return null;
    })
    .filter((attachment): attachment is NonNullable<typeof attachment> => attachment !== null);
};

const normalizeModules = (modules: unknown): ModuleForm[] => {
  if (!Array.isArray(modules)) {
    return [];
  }

  return modules.map((moduleItem, moduleIndex) => {
    const moduleRecord = moduleItem as Record<string, unknown>;
    const moduleId =
      (typeof moduleRecord.moduleId === "string" && moduleRecord.moduleId) ||
      (typeof moduleRecord.id === "string" && moduleRecord.id) ||
      crypto.randomUUID();
    const lessons = Array.isArray(moduleRecord.lessons) ? moduleRecord.lessons : [];

    return {
      id: moduleId,
      backendId: moduleId,
      title:
        typeof moduleRecord.title === "string" ? moduleRecord.title : `Module ${moduleIndex + 1}`,
      lessons: lessons.map((lessonItem, lessonIndex) => {
        const lessonRecord = lessonItem as Record<string, unknown>;
        const lessonId =
          (typeof lessonRecord._id === "string" && lessonRecord._id) ||
          (typeof lessonRecord.id === "string" && lessonRecord.id) ||
          crypto.randomUUID();

        return {
          id: lessonId,
          backendId: lessonId,
          title:
            typeof lessonRecord.title === "string"
              ? lessonRecord.title
              : `Lesson ${lessonIndex + 1}`,
          type: normalizeLessonType(
            typeof lessonRecord.type === "string" ? lessonRecord.type : undefined
          ),
          description: typeof lessonRecord.description === "string" ? lessonRecord.description : "",
          resourceLink: normalizeResourceLink(
            lessonRecord.contentFile ??
              lessonRecord.readingContent ??
              lessonRecord.video ??
              lessonRecord.resourceLink
          ),
          quizId: normalizeQuizId(lessonRecord.quiz),
          objectives: Array.isArray(lessonRecord.learningObjectives)
            ? (lessonRecord.learningObjectives as string[])
            : [],
          prerequisites:
            typeof lessonRecord.prerequisiteLesson === "string" && lessonRecord.prerequisiteLesson
              ? [lessonRecord.prerequisiteLesson]
              : [],
          attachments: normalizeAttachments(lessonRecord.attachments),
          isPublished: lessonRecord.isVisible !== false
        } satisfies LessonForm;
      })
    } satisfies ModuleForm;
  });
};

const normalizeStatus = (status: string): CourseStatus => {
  if (status === "PUBLISHED" || status === "DRAFT" || status === "SCHEDULED") {
    return status;
  }

  if (status === "Active") {
    return "PUBLISHED";
  }

  if (status === "Upcoming") {
    return "SCHEDULED";
  }

  return "DRAFT";
};

export default function EditCoursePage() {
  const params = useParams<{ slug: string | string[] }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const { data: course, isPending } = useGetCourseDetails(slug);

  if (isPending) {
    return (
      <section className="flex flex-col gap-6">
        <p className="text-sm text-muted-foreground">Loading course details...</p>
      </section>
    );
  }

  if (!course?.data) {
    return (
      <section className="flex flex-col gap-6">
        <p className="text-sm text-muted-foreground">Course not found.</p>
      </section>
    );
  }

  const initialValues = {
    title: course.data.title,
    status: normalizeStatus(course.data.status),
    description: course.data.description,
    thumbnailUrl: course.data.thumbnail,
    modules: normalizeModules(course.data.curriculum)
  };

  return (
    <section className="flex flex-col gap-6">
      <CreateCourse
        mode="edit"
        courseId={course.data._id}
        courseSlug={slug}
        initialValues={initialValues}
        initialThumbnailPreviewUrl={course.data.thumbnail}
        subheading="Edit Course"
        submitLabel="Update Course"
      />
    </section>
  );
}
