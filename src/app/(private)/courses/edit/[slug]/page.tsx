import { notFound } from "next/navigation";

import type { CourseStatus, LessonForm, ModuleForm } from "@/types/course-form";

import { api as instance } from "@/lib/api";
import { CourseDetailsResponse } from "@/lib/api/courses/get-details";

import CreateCourse from "../../create/component/CreateCourse";

const normalizeLessonType = (type?: string): LessonForm["type"] => {
  if (type === "READING" || type === "reading") {
    return "reading";
  }

  if (type === "ASSIGNMENT" || type === "assignment") {
    return "assignment";
  }

  return "video";
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
          isDraft: false,
          title:
            typeof lessonRecord.title === "string"
              ? lessonRecord.title
              : `Lesson ${lessonIndex + 1}`,
          type: normalizeLessonType(
            typeof lessonRecord.type === "string" ? lessonRecord.type : undefined
          ),
          description: typeof lessonRecord.description === "string" ? lessonRecord.description : "",
          resourceLink:
            typeof lessonRecord.contentFile === "string" ? lessonRecord.contentFile : "",
          objectives: Array.isArray(lessonRecord.learningObjectives)
            ? (lessonRecord.learningObjectives as string[])
            : [],
          prerequisites:
            typeof lessonRecord.prerequisiteLesson === "string" && lessonRecord.prerequisiteLesson
              ? [lessonRecord.prerequisiteLesson]
              : [],
          attachments: Array.isArray(lessonRecord.attachments)
            ? (lessonRecord.attachments as string[])
            : [],
          isPublished: Boolean(lessonRecord.isVisible)
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

interface EditCoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { slug } = await params;

  const { data: course } = await instance.get<CourseDetailsResponse>(`/courses/${slug}`);

  if (!course) {
    notFound();
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
