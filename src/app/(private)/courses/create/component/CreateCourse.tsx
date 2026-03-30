"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import type { CourseForm, LessonForm, ModuleForm } from "@/types/course-form";

import { api as instance } from "@/lib/api";
import { useAddModule } from "@/lib/api/courses/add-module";
import { useCreateCourse, useUpdateCourse } from "@/lib/api/courses/create-course";
import { useCreateLesson } from "@/lib/api/courses/create-lesson";
import { useDeleteLesson } from "@/lib/api/courses/delete-lesson";
import { useDeleteModule } from "@/lib/api/courses/delete-module";
import { useReorderLessons } from "@/lib/api/courses/reorder-lessons";
import { useReorderModules } from "@/lib/api/courses/reorder-modules";
import { useUpdateLesson } from "@/lib/api/courses/update-lesson";
import { useUpdateModule } from "@/lib/api/courses/update-module";
import { useGetQuizzes } from "@/lib/api/quiz-builder/get-quizzes";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import type { CreateCoursePayload, GetLessonByIdResponse, LessonContentType } from "@/types";

import CourseDetailsForm from "./form/CourseDetailsForm";
import CurriculumBuilder from "./form/CurriculumBuilder";
import LessonEditor from "./form/LessonEditor";
import { courseFormSchema } from "./form/schema/course-form.schema";

const createLessonDraft = (): LessonForm => ({
  id: crypto.randomUUID(),
  title: "",
  type: "video",
  description: "",
  resourceLink: "",
  quizId: "",
  objectives: [],
  prerequisites: [],
  attachments: [],
  isPublished: true
});

const createModule = (): ModuleForm => ({
  id: crypto.randomUUID(),
  title: "New Module",
  lessons: []
});

const toApiLessonType = (type: LessonForm["type"]): LessonContentType => {
  if (type === "reading") {
    return "READING";
  }

  if (type === "quiz") {
    return "QUIZ";
  }

  return "VIDEO";
};

const toFormLessonType = (type: LessonContentType): LessonForm["type"] => {
  if (type === "READING") {
    return "reading";
  }

  if (type === "QUIZ") {
    return "quiz";
  }

  return "video";
};

const resolveQuizId = (val: unknown): string => {
  if (!val) {
    return "";
  }

  if (typeof val === "string") {
    return val;
  }

  if (typeof val === "object" && val !== null && "_id" in val) {
    return String((val as Record<string, unknown>)._id ?? "");
  }

  return "";
};

const resolveResourceLink = (val: unknown): string => {
  if (!val) {
    return "";
  }

  if (typeof val === "string") {
    return val;
  }

  if (typeof val === "object" && val !== null) {
    const valueRecord = val as Record<string, unknown>;
    const possibleKeys = ["url", "secure_url", "location", "path", "href", "fileUrl"];

    for (const key of possibleKeys) {
      const candidate = valueRecord[key];
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate;
      }
    }
  }

  return "";
};

const resolveAttachmentUrl = (attachment: unknown): string | null => {
  if (!attachment) {
    return null;
  }

  if (typeof attachment === "string") {
    return attachment;
  }

  if (typeof attachment === "object" && attachment !== null && "url" in attachment) {
    const url = (attachment as Record<string, unknown>).url;
    return typeof url === "string" && url.trim() ? url : null;
  }

  return null;
};

// The API may return `prerequisiteLesson` as a populated document object
// instead of a plain string ID. Safely extract the string ID from either.
const resolvePrerequisiteId = (val: unknown): string | null => {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null && "_id" in val)
    return String((val as Record<string, unknown>)._id);
  return null;
};

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
  courseId?: string;
  courseSlug?: string;
  mode?: "create" | "edit";
  heading?: string;
  subheading?: string;
  submitLabel?: string;
}

export default function CreateCourse({
  initialValues,
  initialThumbnailPreviewUrl,
  courseId,
  courseSlug,
  mode = "create",
  heading = "Course Management",
  subheading = "Create New Course",
  submitLabel = "Create Course"
}: CreateCourseProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
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
  const [pendingModuleId, setPendingModuleId] = useState<string | null>(null);
  const [pendingLessonKey, setPendingLessonKey] = useState<string | null>(null);
  const [isUpdatingCourse, setIsUpdatingCourse] = useState(false);
  const moduleDebounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const contentFiles = useRef<Record<string, File | null>>({});
  const attachmentFiles = useRef<Record<string, File[]>>({});

  const form = useForm<CourseForm>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: initialValues ?? defaultValues
  });

  useEffect(() => {
    const timers = moduleDebounceTimers.current;

    return () => {
      if (thumbnailPreviewUrl) {
        URL.revokeObjectURL(thumbnailPreviewUrl);
      }

      Object.values(timers).forEach((timer) => clearTimeout(timer));
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

  useEffect(() => {
    if (modules.length === 0) {
      setActiveModuleIndex(-1);
      setActiveLessonIndex(-1);
      return;
    }

    if (activeModuleIndex < 0 || activeModuleIndex >= modules.length) {
      setActiveModuleIndex(0);
    }

    const lessons = modules[activeModuleIndex]?.lessons ?? [];
    if (lessons.length === 0) {
      setActiveLessonIndex(-1);
      return;
    }

    if (activeLessonIndex < 0 || activeLessonIndex >= lessons.length) {
      setActiveLessonIndex(0);
    }
  }, [activeLessonIndex, activeModuleIndex, modules]);

  const prerequisiteOptions = useMemo(() => {
    return modules
      .flatMap((module) => module.lessons)
      .filter((lesson) => lesson.id !== activeLesson?.id)
      .map((lesson) => ({ id: lesson.id, title: lesson.title || "Untitled Lesson" }));
  }, [modules, activeLesson?.id]);

  const { mutateAsync: addModule } = useAddModule();
  const { mutateAsync: updateModule } = useUpdateModule();
  const { mutateAsync: deleteModule } = useDeleteModule();
  const { mutateAsync: createLesson } = useCreateLesson();
  const { mutateAsync: updateLesson } = useUpdateLesson();
  const { mutateAsync: deleteLesson } = useDeleteLesson();
  const { mutateAsync: reorderLessons } = useReorderLessons();

  const { data: quizzesData } = useGetQuizzes({ page: 1, limit: 100 }, isEditMode);

  const quizOptions = useMemo(
    () => (quizzesData?.data ?? []).map((quiz) => ({ id: quiz._id, title: quiz.title })),
    [quizzesData?.data]
  );
  const { mutateAsync: reorderModules } = useReorderModules();
  const { mutateAsync: updateCourse } = useUpdateCourse();

  const handleAddModule = async () => {
    if (!courseId) {
      toast.error("Course identifier not found.");
      return;
    }

    try {
      const response = await addModule({ courseId, title: "New Module" });
      const moduleData = response.data;
      const nextIndex = moduleFieldArray.fields.length;

      moduleFieldArray.append({
        ...createModule(),
        id: moduleData.moduleId,
        backendId: moduleData.moduleId,
        title: moduleData.title
      });

      setActiveModuleIndex(nextIndex);
      setActiveLessonIndex(-1);
      toast.success(response.message || "Module added successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add module.";
      toast.error(message);
    }
  };

  const handleModuleTitleChange = (moduleIndex: number, nextTitle: string) => {
    const modulePath = `modules.${moduleIndex}.title` as const;
    form.setValue(modulePath, nextTitle, { shouldDirty: true });

    const moduleId = form.getValues(`modules.${moduleIndex}.backendId`);
    if (!moduleId || !courseId) {
      return;
    }

    const currentTimer = moduleDebounceTimers.current[moduleId];
    if (currentTimer) {
      clearTimeout(currentTimer);
    }

    moduleDebounceTimers.current[moduleId] = setTimeout(async () => {
      try {
        setPendingModuleId(moduleId);
        await updateModule({
          courseId,
          moduleId,
          payload: { title: form.getValues(modulePath) }
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update module title.";
        toast.error(message);
      } finally {
        setPendingModuleId(null);
      }
    }, 2000);
  };

  const handleRemoveModule = async (moduleIndex: number) => {
    const moduleId = form.getValues(`modules.${moduleIndex}.backendId`);

    if (moduleId && courseId) {
      try {
        await deleteModule({ courseId, moduleId });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete module.";
        toast.error(message);
        return;
      }
    }

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
      setActiveLessonIndex(-1);
    }

    toast.success("Module deleted successfully.");
  };

  const handleAddLesson = (moduleIndex: number) => {
    const currentLessons = form.getValues(`modules.${moduleIndex}.lessons`);
    form.setValue(`modules.${moduleIndex}.lessons`, [...currentLessons, createLessonDraft()], {
      shouldDirty: true
    });
    setActiveModuleIndex(moduleIndex);
    setActiveLessonIndex(currentLessons.length);
  };

  const handleRemoveLesson = async (moduleIndex: number, lessonIndex: number) => {
    const lesson = form.getValues(`modules.${moduleIndex}.lessons.${lessonIndex}`);
    const moduleId = form.getValues(`modules.${moduleIndex}.backendId`);

    if (lesson?.backendId && moduleId && courseId) {
      try {
        await deleteLesson({
          courseId,
          moduleId,
          lessonId: lesson.backendId
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete lesson.";
        toast.error(message);
        return;
      }
    }

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

    toast.success("Lesson deleted successfully.");
  };

  const handleSelectLesson = (moduleIndex: number, lessonIndex: number) => {
    setActiveModuleIndex(moduleIndex);
    setActiveLessonIndex(lessonIndex);

    const selectedLesson = form.getValues(`modules.${moduleIndex}.lessons.${lessonIndex}`);
    if (!selectedLesson?.backendId || !courseId) {
      return;
    }

    void handleEditLesson(moduleIndex, lessonIndex);
  };

  const handleMoveModule = async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) {
      return;
    }

    const currentModules = form.getValues("modules");
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= currentModules.length ||
      toIndex >= currentModules.length
    ) {
      return;
    }

    const nextModules = [...currentModules];
    const [movedModule] = nextModules.splice(fromIndex, 1);
    nextModules.splice(toIndex, 0, movedModule);
    form.setValue("modules", nextModules, { shouldDirty: true });

    if (activeModuleIndex === fromIndex) {
      setActiveModuleIndex(toIndex);
    } else if (fromIndex < activeModuleIndex && activeModuleIndex <= toIndex) {
      setActiveModuleIndex((prev) => prev - 1);
    } else if (toIndex <= activeModuleIndex && activeModuleIndex < fromIndex) {
      setActiveModuleIndex((prev) => prev + 1);
    }

    if (!courseId) {
      return;
    }

    const moduleOrder = nextModules
      .map((module) => module.backendId)
      .filter((moduleId): moduleId is string => Boolean(moduleId));

    if (moduleOrder.length !== nextModules.length) {
      return;
    }

    try {
      await reorderModules({ courseId, moduleOrder });
    } catch {
      toast.error("Failed to reorder modules.");
    }
  };

  const handleMoveLesson = async (moduleIndex: number, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) {
      return;
    }

    const currentLessons = form.getValues(`modules.${moduleIndex}.lessons`);
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= currentLessons.length ||
      toIndex >= currentLessons.length
    ) {
      return;
    }

    const nextLessons = [...currentLessons];
    const [movedLesson] = nextLessons.splice(fromIndex, 1);
    nextLessons.splice(toIndex, 0, movedLesson);
    form.setValue(`modules.${moduleIndex}.lessons`, nextLessons, { shouldDirty: true });

    if (moduleIndex === activeModuleIndex) {
      if (activeLessonIndex === fromIndex) {
        setActiveLessonIndex(toIndex);
      } else if (fromIndex < activeLessonIndex && activeLessonIndex <= toIndex) {
        setActiveLessonIndex((prev) => prev - 1);
      } else if (toIndex <= activeLessonIndex && activeLessonIndex < fromIndex) {
        setActiveLessonIndex((prev) => prev + 1);
      }
    }

    if (!courseId) {
      return;
    }

    const moduleId = form.getValues(`modules.${moduleIndex}.backendId`);
    if (!moduleId) {
      return;
    }

    const lessonOrder = nextLessons
      .map((lesson) => lesson.backendId)
      .filter((lessonId): lessonId is string => Boolean(lessonId));

    if (lessonOrder.length !== nextLessons.length) {
      return;
    }

    try {
      await reorderLessons({ courseId, moduleId, lessonOrder });
    } catch {
      toast.error("Failed to reorder lessons.");
    }
  };

  const handleEditLesson = async (moduleIndex: number, lessonIndex: number) => {
    setActiveModuleIndex(moduleIndex);
    setActiveLessonIndex(lessonIndex);

    const selectedLesson = form.getValues(`modules.${moduleIndex}.lessons.${lessonIndex}`);
    if (!selectedLesson.backendId || !courseId) {
      return;
    }

    try {
      const response = await instance.get<GetLessonByIdResponse>(
        `/courses/${courseId}/lessons/${selectedLesson.backendId}`
      );
      const lesson = response.data.data;

      form.setValue(`modules.${moduleIndex}.lessons.${lessonIndex}`, {
        ...selectedLesson,
        backendId: String(lesson._id),
        title: lesson.title,
        type: toFormLessonType(lesson.type),
        description: lesson.description ?? "",
        resourceLink: resolveResourceLink(
          lesson.contentFile ?? lesson.readingContent ?? lesson.video ?? selectedLesson.resourceLink
        ),
        objectives: lesson.learningObjectives ?? [],
        quizId: resolveQuizId(lesson.quiz),
        prerequisites: (() => {
          const id = resolvePrerequisiteId(lesson.prerequisiteLesson as unknown);
          return id ? [id] : [];
        })(),
        attachments: lesson.attachments ?? [],
        isPublished: lesson.isVisible ?? true
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load lesson data.";
      toast.error(message);
    }
  };

  const handleSaveLesson = async (moduleIndex: number, lessonIndex: number) => {
    if (!courseId) {
      toast.error("Course identifier not found.");
      return;
    }

    const moduleId = form.getValues(`modules.${moduleIndex}.backendId`);
    if (!moduleId) {
      toast.error("Module identifier not found.");
      return;
    }

    const lessonPath = `modules.${moduleIndex}.lessons.${lessonIndex}` as const;
    const lesson = form.getValues(lessonPath);
    const valid = await form.trigger([`${lessonPath}.title`, `${lessonPath}.description`]);

    if (!valid) {
      toast.error("Please complete required lesson fields before saving.");
      return;
    }

    const lessonKey = `${moduleIndex}-${lessonIndex}`;

    try {
      setPendingLessonKey(lessonKey);
      const contentFile = contentFiles.current[lessonKey] ?? undefined;
      const attachments = attachmentFiles.current[lessonKey] ?? [];
      const existingAttachments = (lesson.attachments ?? [])
        .map((attachment) => resolveAttachmentUrl(attachment))
        .filter((attachmentUrl): attachmentUrl is string => Boolean(attachmentUrl));
      const payload = {
        title: lesson.title,
        type: toApiLessonType(lesson.type),
        description: lesson.description,
        learningObjectives: lesson.objectives,
        isVisible: lesson.isPublished ?? true,
        prerequisiteLesson: lesson.prerequisites[0],
        quiz: lesson.type === "quiz" ? lesson.quizId || undefined : undefined,
        contentFile: lesson.type === "quiz" ? undefined : contentFile,
        attachments: attachments.length > 0 ? attachments : undefined,
        existingAttachments: existingAttachments.length > 0 ? existingAttachments : undefined
      };

      if (!lesson.backendId) {
        const response = await createLesson({
          courseId,
          moduleId,
          payload
        });
        const createdLesson = response.data;

        form.setValue(lessonPath, {
          ...lesson,
          id: String(createdLesson._id),
          backendId: String(createdLesson._id),
          title: createdLesson.title,
          type: toFormLessonType(createdLesson.type),
          description: createdLesson.description ?? "",
          resourceLink: resolveResourceLink(
            createdLesson.contentFile ??
              createdLesson.readingContent ??
              createdLesson.video ??
              lesson.resourceLink
          ),
          objectives: createdLesson.learningObjectives ?? [],
          quizId: resolveQuizId(createdLesson.quiz),
          prerequisites: (() => {
            const id = resolvePrerequisiteId(createdLesson.prerequisiteLesson as unknown);
            return id ? [id] : [];
          })(),
          attachments: createdLesson.attachments ?? [],
          isPublished: createdLesson.isVisible ?? true
        });

        delete attachmentFiles.current[lessonKey];
        toast.success(response.message || "Lesson created successfully.");
        return;
      }

      const response = await updateLesson({
        courseId,
        moduleId,
        lessonId: lesson.backendId,
        payload
      });

      const updatedLesson = response.data;
      if (updatedLesson) {
        form.setValue(lessonPath, {
          ...lesson,
          backendId: String(updatedLesson._id),
          title: updatedLesson.title,
          type: toFormLessonType(updatedLesson.type),
          description: updatedLesson.description ?? "",
          resourceLink: resolveResourceLink(
            updatedLesson.contentFile ??
              updatedLesson.readingContent ??
              updatedLesson.video ??
              lesson.resourceLink
          ),
          objectives: updatedLesson.learningObjectives ?? [],
          quizId: resolveQuizId(updatedLesson.quiz),
          prerequisites: (() => {
            const id = resolvePrerequisiteId(updatedLesson.prerequisiteLesson as unknown);
            return id ? [id] : [];
          })(),
          attachments: updatedLesson.attachments ?? [],
          isPublished: updatedLesson.isVisible ?? true
        });
      }

      delete attachmentFiles.current[lessonKey];
      toast.success(response.message || "Lesson updated successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save lesson.";
      toast.error(message);
    } finally {
      setPendingLessonKey(null);
    }
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

  const handleEditSubmit = async () => {
    if (!courseId) {
      toast.error("Course identifier not found.");
      return;
    }

    const valid = await form.trigger(["title", "description", "status", "thumbnailUrl"]);
    if (!valid) {
      toast.error("Please complete all required course fields.");
      return;
    }

    const values = form.getValues();

    try {
      setIsUpdatingCourse(true);
      const response = await updateCourse({
        courseId,
        title: values.title,
        description: values.description,
        status: values.status,
        thumbnail: thumbnailFile ?? undefined
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to update course.");
      }

      if (courseSlug) {
        await queryClient.invalidateQueries({
          queryKey: ["course-details", courseSlug]
        });
        await queryClient.refetchQueries({
          queryKey: ["course-details", courseSlug],
          type: "all"
        });
      }

      toast.success(response.message || "Course updated successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update course.";
      toast.error(message);
    } finally {
      setIsUpdatingCourse(false);
    }
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-6">
        <Card className="flex flex-col gap-4 border-none bg-transparent pt-0 shadow-none">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-foreground">{heading}</h1>
              <p className="text-sm text-muted-foreground">{subheading}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type={isEditMode ? "button" : "submit"}
                className="gap-2"
                onClick={isEditMode ? () => void handleEditSubmit() : undefined}
                disabled={isEditMode ? isUpdatingCourse : false}
              >
                <Send className="h-4 w-4" />
                {isEditMode && isUpdatingCourse ? "Updating..." : submitLabel}
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
              pendingModuleId={pendingModuleId}
              onAddModule={handleAddModule}
              onModuleTitleChange={handleModuleTitleChange}
              onMoveModule={handleMoveModule}
              onRemoveModule={handleRemoveModule}
              onAddLesson={handleAddLesson}
              onMoveLesson={handleMoveLesson}
              onRemoveLesson={handleRemoveLesson}
              onSelectLesson={handleSelectLesson}
              onEditLesson={handleEditLesson}
            />

            {activeLesson ? (
              <LessonEditor
                key={activeLesson.id}
                form={form}
                moduleIndex={activeModuleIndex}
                lessonIndex={activeLessonIndex}
                lessonId={activeLesson.id}
                quizOptions={quizOptions}
                prerequisiteOptions={prerequisiteOptions}
                isSubmitting={pendingLessonKey === `${activeModuleIndex}-${activeLessonIndex}`}
                onSubmitLesson={() => handleSaveLesson(activeModuleIndex, activeLessonIndex)}
                onContentFileChange={(file) => {
                  contentFiles.current[`${activeModuleIndex}-${activeLessonIndex}`] = file;
                }}
                onAttachmentFilesChange={(files) => {
                  attachmentFiles.current[`${activeModuleIndex}-${activeLessonIndex}`] = files;
                }}
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
