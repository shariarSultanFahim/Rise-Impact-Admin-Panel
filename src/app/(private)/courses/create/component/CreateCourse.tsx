"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { BookOpen, Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import type { CourseForm, LessonForm, ModuleForm } from "@/types/course-form";

import { useCreateCourse } from "@/lib/api/courses/create-course";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import type { CreateCoursePayload } from "@/types";

import CourseDetailsForm from "./form/CourseDetailsForm";
import CurriculumBuilder from "./form/CurriculumBuilder";
import LessonEditor from "./form/LessonEditor";
import { courseFormSchema } from "./form/schema/course-form.schema";

const createLesson = (): LessonForm => ({
  id: crypto.randomUUID(),
  title: "New Lesson",
  type: "video",
  description: "",
  resourceLink: "",
  objectives: [],
  prerequisites: [],
  attachments: [],
  isPublished: false
});

const createModule = (): ModuleForm => ({
  id: crypto.randomUUID(),
  title: "New Module",
  lessons: [createLesson()]
});

const defaultValues: CourseForm = {
  title: "",
  status: "DRAFT",
  description: "",
  thumbnailUrl: "",
  modules: []
};

interface CreateCourseProps {
  initialValues?: CourseForm;
  initialThumbnailPreviewUrl?: string;
  mode?: "create" | "edit";
  heading?: string;
  subheading?: string;
  submitLabel?: string;
}

export default function CreateCourse({
  initialValues,
  initialThumbnailPreviewUrl,
  mode = "create",
  heading = "Course Management",
  subheading = "Create New Course",
  submitLabel = "Create Course"
}: CreateCourseProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailName, setThumbnailName] = useState<string | null>(
    initialValues?.thumbnailUrl ?? null
  );
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(
    initialThumbnailPreviewUrl ?? null
  );

  const form = useForm<CourseForm>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: initialValues ?? defaultValues
  });

  useEffect(() => {
    return () => {
      if (thumbnailPreviewUrl) {
        URL.revokeObjectURL(thumbnailPreviewUrl);
      }
    };
  }, [thumbnailPreviewUrl]);

  const moduleFieldArray = useFieldArray({
    control: form.control,
    name: "modules"
  });

  const watchedModules = useWatch({ control: form.control, name: "modules" });
  const modules = useMemo(() => watchedModules ?? [], [watchedModules]);

  const activeLesson =
    activeModuleIndex >= 0 && activeLessonIndex >= 0
      ? (modules?.[activeModuleIndex]?.lessons?.[activeLessonIndex] ?? null)
      : null;

  const prerequisiteOptions = useMemo(() => {
    return modules
      .flatMap((module) => module.lessons)
      .filter((lesson) => lesson.id !== activeLesson?.id)
      .map((lesson) => ({ id: lesson.id, title: lesson.title || "Untitled Lesson" }));
  }, [modules, activeLesson?.id]);

  const handleAddModule = () => {
    moduleFieldArray.append(createModule());
    const nextIndex = moduleFieldArray.fields.length;
    setActiveModuleIndex(nextIndex);
    setActiveLessonIndex(0);
  };

  const handleRemoveModule = (moduleIndex: number) => {
    moduleFieldArray.remove(moduleIndex);
    const nextLength = moduleFieldArray.fields.length - 1;
    if (nextLength <= 0) {
      setActiveModuleIndex(-1);
      setActiveLessonIndex(-1);
      return;
    }

    if (moduleIndex < activeModuleIndex) {
      setActiveModuleIndex(activeModuleIndex - 1);
      return;
    }

    if (moduleIndex === activeModuleIndex) {
      setActiveModuleIndex(Math.min(activeModuleIndex, nextLength - 1));
      setActiveLessonIndex(0);
    }
  };

  const handleAddLesson = (moduleIndex: number) => {
    const currentLessons = form.getValues(`modules.${moduleIndex}.lessons`);
    form.setValue(`modules.${moduleIndex}.lessons`, [...currentLessons, createLesson()], {
      shouldDirty: true
    });
    setActiveModuleIndex(moduleIndex);
    setActiveLessonIndex(currentLessons.length);
  };

  const handleRemoveLesson = (moduleIndex: number, lessonIndex: number) => {
    const currentLessons = form.getValues(`modules.${moduleIndex}.lessons`);
    const nextLessons = currentLessons.filter((_, index) => index !== lessonIndex);
    form.setValue(`modules.${moduleIndex}.lessons`, nextLessons, { shouldDirty: true });

    if (moduleIndex !== activeModuleIndex) {
      return;
    }

    if (nextLessons.length === 0) {
      setActiveLessonIndex(-1);
      return;
    }

    if (lessonIndex < activeLessonIndex) {
      setActiveLessonIndex(activeLessonIndex - 1);
      return;
    }

    if (lessonIndex === activeLessonIndex) {
      setActiveLessonIndex(Math.min(activeLessonIndex, nextLessons.length - 1));
    }
  };

  const handleSelectLesson = (moduleIndex: number, lessonIndex: number) => {
    setActiveModuleIndex(moduleIndex);
    setActiveLessonIndex(lessonIndex);
  };

  const handleThumbnailChange = (file: File | null) => {
    if (thumbnailPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreviewUrl);
    }
    setThumbnailFile(file);
    setThumbnailName(file?.name ?? null);
    form.setValue("thumbnailUrl", file?.name ?? "", { shouldValidate: true });
    setThumbnailPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleEditSubmit = (values: CourseForm) => {
    if (values.modules.length === 0) {
      form.setError("modules", {
        type: "manual",
        message: "Add at least one module"
      });
      toast.error("Add at least one module before updating the course.");
      return;
    }

    const lessonsMissingResources = values.modules.flatMap((module, moduleIndex) =>
      module.lessons
        .filter((lesson) => !lesson.resourceLink)
        .map((_, lessonIndex) => ({
          moduleIndex,
          lessonIndex
        }))
    );

    if (lessonsMissingResources.length > 0) {
      lessonsMissingResources.forEach(({ moduleIndex, lessonIndex }) => {
        form.setError(`modules.${moduleIndex}.lessons.${lessonIndex}.resourceLink`, {
          type: "manual",
          message: "Upload the lesson resource before publishing."
        });
      });
      toast.error("Upload all lesson resources before publishing.");
      return;
    }

    toast.success(`${submitLabel} successful.`);
  };
  const { mutateAsync: createCourse } = useCreateCourse();

  const handleCreateSubmit = async (values: CourseForm) => {
    if (!thumbnailFile) {
      form.setError("thumbnailUrl", {
        type: "manual",
        message: "Upload a course thumbnail before creating the course."
      });
      return;
    }

    try {
      const payload: CreateCoursePayload = {
        title: values.title,
        description: values.description,
        status: values.status,
        thumbnail: thumbnailFile
      };

      const response = await createCourse(payload);

      if (!response.success) {
        throw new Error(response.message || "Failed to create course.");
      }

      const createdCourseSlug = response.data?.slug;

      if (!createdCourseSlug) {
        throw new Error("Course created but no course slug was returned.");
      }

      toast.success(
        response.message || "Course created successfully. Continue editing modules and lessons."
      );
      router.push(`/courses/edit/${createdCourseSlug}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create course.";
      toast.error(message);
    }
  };

  const handleSubmit = isEditMode ? handleEditSubmit : handleCreateSubmit;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card className="flex flex-col gap-4 border-none bg-transparent pt-0 shadow-none">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-foreground">{heading}</h1>
              <p className="text-sm text-muted-foreground">{subheading}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" className="gap-2">
                <Send className="h-4 w-4" />
                {submitLabel}
              </Button>
            </div>
          </div>
        </Card>

        <CourseDetailsForm
          form={form}
          onThumbnailChange={handleThumbnailChange}
          thumbnailName={thumbnailName}
          thumbnailPreviewUrl={thumbnailPreviewUrl}
          subheading={subheading}
        />

        {isEditMode && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <CurriculumBuilder
              form={form}
              modules={moduleFieldArray.fields}
              activeModuleIndex={activeModuleIndex}
              activeLessonIndex={activeLessonIndex}
              onAddModule={handleAddModule}
              onRemoveModule={handleRemoveModule}
              onAddLesson={handleAddLesson}
              onRemoveLesson={handleRemoveLesson}
              onSelectLesson={handleSelectLesson}
            />

            {activeLesson ? (
              <LessonEditor
                key={activeLesson.id}
                form={form}
                moduleIndex={activeModuleIndex}
                lessonIndex={activeLessonIndex}
                lessonId={activeLesson.id}
                prerequisiteOptions={prerequisiteOptions}
              />
            ) : (
              <Card className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-muted bg-muted/10 p-6 text-center">
                <div className="rounded-full bg-muted p-3 text-muted-foreground">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">No Lesson Selected</p>
                  <p className="text-xs text-muted-foreground">
                    Select a lesson from the curriculum or add a new one to start editing.
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
