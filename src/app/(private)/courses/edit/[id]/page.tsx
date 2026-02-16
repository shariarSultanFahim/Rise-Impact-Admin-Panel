import { notFound } from "next/navigation";

import { getCourseDetail } from "@/data/course-detail";

import CreateCourse from "../../create/component/CreateCourse";

interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  const course = await getCourseDetail(id);

  if (!course) {
    notFound();
  }

  const { thumbnailPreviewUrl, ...initialValues } = course;

  return (
    <section className="flex flex-col gap-6">
      <CreateCourse
        initialValues={initialValues}
        initialThumbnailPreviewUrl={thumbnailPreviewUrl}
        subheading="Edit Course"
        submitLabel="Update Course"
      />
    </section>
  );
}
