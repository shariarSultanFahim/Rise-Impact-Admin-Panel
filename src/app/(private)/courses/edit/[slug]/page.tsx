import { notFound } from "next/navigation";

import type { CourseStatus } from "@/types/course-form";

import { api as instance } from "@/lib/api";
import { CourseDetailsResponse } from "@/lib/api/courses/get-details";

import CreateCourse from "../../create/component/CreateCourse";

const normalizeStatus = (status: string): CourseStatus => {
  if (
    status === "PUBLISHED" ||
    status === "DRAFT" ||
    status === "ARCHIVED" ||
    status === "SCHEDULED"
  ) {
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
    modules: course.data.modules ?? []
  };

  return (
    <section className="flex flex-col gap-6">
      <CreateCourse
        mode="edit"
        initialValues={initialValues}
        initialThumbnailPreviewUrl={course.data.thumbnail}
        subheading="Edit Course"
        submitLabel="Update Course"
      />
    </section>
  );
}
