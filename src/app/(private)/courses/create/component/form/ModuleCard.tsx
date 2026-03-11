"use client";

import { BookOpen, ClipboardCheck, GripVertical, Pencil, Plus, Trash2, Video } from "lucide-react";
import { useFieldArray, useWatch, type UseFormReturn } from "react-hook-form";

import type { CourseForm } from "@/types/course-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ModuleCardProps {
  form: UseFormReturn<CourseForm>;
  moduleIndex: number;
  isActive: boolean;
  activeLessonIndex: number;
  pendingModuleId: string | null;
  onSelectLesson: (moduleIndex: number, lessonIndex: number) => void;
  onModuleTitleChange: (moduleIndex: number, nextTitle: string) => void;
  onRemoveModule: (moduleIndex: number) => void;
  onAddLesson: (moduleIndex: number) => void;
  onRemoveLesson: (moduleIndex: number, lessonIndex: number) => void;
  onEditLesson: (moduleIndex: number, lessonIndex: number) => void;
}

export default function ModuleCard({
  form,
  moduleIndex,
  isActive,
  activeLessonIndex,
  pendingModuleId,
  onSelectLesson,
  onModuleTitleChange,
  onRemoveModule,
  onAddLesson,
  onRemoveLesson,
  onEditLesson
}: ModuleCardProps) {
  const { fields } = useFieldArray({
    control: form.control,
    name: `modules.${moduleIndex}.lessons`
  });

  const lessonValues =
    useWatch({
      control: form.control,
      name: `modules.${moduleIndex}.lessons`
    }) ?? [];

  const lessonCount = lessonValues.length;
  const moduleBackendId = useWatch({
    control: form.control,
    name: `modules.${moduleIndex}.backendId`
  });
  const isModuleUpdating = Boolean(moduleBackendId && moduleBackendId === pendingModuleId);

  const getLessonTypeLabel = (type?: string) => {
    if (type === "reading") {
      return "Reading";
    }
    if (type === "assignment") {
      return "Assignment";
    }
    return "Video";
  };

  const getLessonTypeIcon = (type?: string) => {
    if (type === "reading") {
      return <BookOpen className="h-4 w-4" />;
    }
    if (type === "assignment") {
      return <ClipboardCheck className="h-4 w-4" />;
    }
    return <Video className="h-4 w-4" />;
  };

  return (
    <Card className={`space-y-3 border p-4 ${isActive ? "border-primary/40" : ""}`}>
      <div className="flex flex-wrap items-center gap-3">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        <FormField
          control={form.control}
          name={`modules.${moduleIndex}.title`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  onChange={(event) => {
                    field.onChange(event);
                    onModuleTitleChange(moduleIndex, event.target.value);
                  }}
                  className="h-8 border-transparent bg-white text-sm font-semibold text-foreground focus-visible:border-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isModuleUpdating ? <span>Saving...</span> : null}
          <span>{lessonCount} Draft</span>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            aria-label="Delete module"
            onClick={() => onRemoveModule(moduleIndex)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {fields.length === 0 ? (
          <p className="rounded-md border border-dashed border-muted bg-white px-3 py-3 text-xs text-muted-foreground">
            No lesson created yet
          </p>
        ) : (
          fields.map((lessonField, lessonIndex) => {
            const isSelected = isActive && lessonIndex === activeLessonIndex;
            const lesson = lessonValues[lessonIndex];
            const lessonTypeLabel = getLessonTypeLabel(lesson?.type);
            return (
              <div
                key={lessonField.id}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left text-xs transition ${
                  isSelected
                    ? "border-primary/40 bg-muted/40 text-foreground"
                    : "border-muted bg-white text-muted-foreground hover:border-primary/30"
                }`}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="grid h-8 w-8 place-items-center rounded-full bg-muted/60 text-muted-foreground">
                  {getLessonTypeIcon(lesson?.type)}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectLesson(moduleIndex, lessonIndex)}
                  className="flex flex-1 flex-col items-start gap-1 text-left sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-medium text-foreground">
                    {lesson?.title || "New Lesson"}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      Draft
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      {lessonTypeLabel}
                    </span>
                  </span>
                </button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Edit lesson"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEditLesson(moduleIndex, lessonIndex);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  aria-label="Delete lesson"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemoveLesson(moduleIndex, lessonIndex);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full gap-2"
        onClick={() => onAddLesson(moduleIndex)}
      >
        <Plus className="h-4 w-4" />
        Add Lesson
      </Button>
    </Card>
  );
}
