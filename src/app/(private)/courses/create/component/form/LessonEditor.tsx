"use client";

import { useEffect, useState } from "react";

import { BookOpen, Plus, Trash2, Upload } from "lucide-react";
import { useWatch, type UseFormReturn } from "react-hook-form";

import type { CourseForm } from "@/types/course-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface LessonEditorProps {
  form: UseFormReturn<CourseForm>;
  moduleIndex: number;
  lessonIndex: number;
  lessonId: string;
  quizOptions: Array<{ id: string; title: string }>;
  prerequisiteOptions: Array<{ id: string; title: string }>;
  isSubmitting: boolean;
  onSubmitLesson: () => void;
  onContentFileChange: (file: File | null) => void;
  onAttachmentFilesChange: (files: File[]) => void;
}

export default function LessonEditor({
  form,
  moduleIndex,
  lessonIndex,
  lessonId,
  quizOptions,
  prerequisiteOptions,
  isSubmitting,
  onSubmitLesson,
  onContentFileChange,
  onAttachmentFilesChange
}: LessonEditorProps) {
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [selectedAttachmentFiles, setSelectedAttachmentFiles] = useState<File[]>([]);

  const objectives =
    useWatch({
      control: form.control,
      name: `modules.${moduleIndex}.lessons.${lessonIndex}.objectives`
    }) ?? [];

  const attachments =
    useWatch({
      control: form.control,
      name: `modules.${moduleIndex}.lessons.${lessonIndex}.attachments`
    }) ?? [];

  const lessonType = useWatch({
    control: form.control,
    name: `modules.${moduleIndex}.lessons.${lessonIndex}.type`
  });

  const resourceLink = useWatch({
    control: form.control,
    name: `modules.${moduleIndex}.lessons.${lessonIndex}.resourceLink`
  });

  const backendLessonId = useWatch({
    control: form.control,
    name: `modules.${moduleIndex}.lessons.${lessonIndex}.backendId`
  });

  const isNewLesson = !backendLessonId;

  useEffect(() => {
    setResourceFile(null);
    setSelectedAttachmentFiles([]);
    onContentFileChange(null);
    onAttachmentFilesChange([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const resourceLabel =
    lessonType === "reading"
      ? "Select Reading Material"
      : lessonType === "quiz"
        ? "Quiz lessons do not require a file"
        : "Select Video File";

  const existingResourceLink =
    typeof resourceLink === "string" && resourceLink.trim().length > 0 ? resourceLink : null;

  const existingResourceName = existingResourceLink
    ? decodeURIComponent(existingResourceLink.split("?")[0]?.split("/").pop() || "existing-file")
    : null;

  const existingAttachments = attachments.map((attachment) => {
    if (typeof attachment === "string") {
      const baseName = attachment.split("?")[0]?.split("/").pop();
      return {
        name: decodeURIComponent(baseName || attachment),
        url: /^https?:\/\//i.test(attachment) ? attachment : ""
      };
    }

    if (typeof attachment === "object" && attachment !== null) {
      const attachmentRecord = attachment as Record<string, unknown>;
      const rawUrl =
        typeof attachmentRecord.url === "string" ? attachmentRecord.url : attachmentRecord.name;
      const rawName =
        typeof attachmentRecord.name === "string" && attachmentRecord.name.trim()
          ? attachmentRecord.name
          : typeof rawUrl === "string"
            ? rawUrl.split("?")[0]?.split("/").pop()
            : "Attachment";

      return {
        name: decodeURIComponent(rawName || "Attachment"),
        url: typeof rawUrl === "string" && /^https?:\/\//i.test(rawUrl) ? rawUrl : ""
      };
    }

    return {
      name: "Attachment",
      url: ""
    };
  });

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {isNewLesson ? "Create New Lesson" : "Edit Lesson"}
        </CardTitle>
        <p className="text-xs text-muted-foreground">Configure lesson content and settings</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name={`modules.${moduleIndex}.lessons.${lessonIndex}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson Title *</FormLabel>
              <FormControl>
                <Input className="bg-white" placeholder="New Lesson" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`modules.${moduleIndex}.lessons.${lessonIndex}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson Type</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue className="bg-white" placeholder="Video Lesson" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Lesson</SelectItem>
                    <SelectItem value="reading">Reading Material</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {lessonType === "quiz" ? (
          <FormField
            control={form.control}
            name={`modules.${moduleIndex}.lessons.${lessonIndex}.quizId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Quiz *</FormLabel>
                <FormControl>
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an existing quiz" />
                    </SelectTrigger>
                    <SelectContent>
                      {quizOptions.length === 0 ? (
                        <div className="px-2 py-1 text-xs text-muted-foreground">
                          No quizzes found. Create a quiz first.
                        </div>
                      ) : (
                        quizOptions.map((quiz) => (
                          <SelectItem key={quiz.id} value={quiz.id}>
                            {quiz.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {lessonType !== "quiz" ? (
          <div className="rounded-xl border border-dashed border-white bg-white px-4 py-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">{resourceLabel}</p>
              <p className="text-xs text-muted-foreground">MP4, MOV, PDF, ZIP (Max 500MB)</p>
            </div>
            <div className="mt-4 flex flex-col items-center gap-2">
              <Input
                type="file"
                className="max-w-[240px]"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setResourceFile(file);
                  onContentFileChange(file);
                }}
              />
              {resourceFile && (
                <p className="max-w-[240px] truncate text-xs text-muted-foreground">
                  Selected: {resourceFile.name}
                </p>
              )}
            </div>

            {existingResourceLink && !resourceFile ? (
              <div className="mt-4 space-y-3 rounded-lg border border-muted bg-muted/20 p-3 text-left">
                <p className="text-xs font-medium text-foreground">
                  Existing {lessonType === "reading" ? "reading file" : "video"}:
                  <span className="ml-1 font-normal text-muted-foreground">
                    {existingResourceName}
                  </span>
                </p>

                {lessonType === "video" ? (
                  <video
                    src={existingResourceLink}
                    controls
                    className="max-h-44 w-full rounded-md border border-muted bg-black"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : null}

                <a
                  href={existingResourceLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex text-xs font-medium text-primary underline-offset-4 hover:underline"
                >
                  Open current file
                </a>
              </div>
            ) : null}
          </div>
        ) : null}

        <FormField
          control={form.control}
          name={`modules.${moduleIndex}.lessons.${lessonIndex}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what students will learn in this lesson..."
                  className="min-h-[120px] bg-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Learning Objectives</Label>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Add learning objective"
              onClick={() =>
                form.setValue(
                  `modules.${moduleIndex}.lessons.${lessonIndex}.objectives`,
                  [...objectives, ""],
                  { shouldDirty: true }
                )
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {objectives.length === 0 ? (
            <p className="text-xs text-muted-foreground">Add a learning objective</p>
          ) : (
            objectives.map((_, index) => (
              <div key={`${lessonId}-objective-${index}`} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`modules.${moduleIndex}.lessons.${lessonIndex}.objectives.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="Add a learning objective"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="hover:bg-red-500 hover:text-white"
                  aria-label="Remove learning objective"
                  onClick={() => {
                    const nextObjectives = objectives.filter((_, itemIndex) => itemIndex !== index);
                    form.setValue(
                      `modules.${moduleIndex}.lessons.${lessonIndex}.objectives`,
                      nextObjectives,
                      { shouldDirty: true }
                    );
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        <FormField
          control={form.control}
          name={`modules.${moduleIndex}.lessons.${lessonIndex}.prerequisites`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prerequisites</FormLabel>
              <div className="space-y-2 rounded-lg border border-muted bg-muted/20 p-3">
                {prerequisiteOptions.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No other lessons available</p>
                ) : (
                  prerequisiteOptions.map((lesson) => (
                    <label key={lesson.id} className="flex items-center gap-2 text-xs">
                      <Checkbox
                        checked={field.value.includes(lesson.id)}
                        onCheckedChange={(checked) => {
                          const nextValue = checked
                            ? [...field.value, lesson.id]
                            : field.value.filter((value) => value !== lesson.id);
                          field.onChange(nextValue);
                        }}
                      />
                      <span>{lesson.title}</span>
                    </label>
                  ))
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <Label>Attachments (PDF)</Label>
          <div className="rounded-lg border border-dashed border-muted bg-muted/10 p-3">
            <Input
              type="file"
              accept="application/pdf,.pdf"
              multiple
              className="bg-white"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                setSelectedAttachmentFiles(files);
                onAttachmentFilesChange(files);
              }}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Upload one or more PDF files as lesson attachments.
            </p>
          </div>

          {selectedAttachmentFiles.length > 0 ? (
            <div className="space-y-1">
              <p className="text-xs font-medium text-foreground">Selected attachments</p>
              {selectedAttachmentFiles.map((file, index) => (
                <div
                  key={`${lessonId}-selected-attachment-${index}`}
                  className="flex items-center gap-2"
                >
                  <p className="flex-1 truncate text-xs text-muted-foreground">{file.name}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remove selected attachment"
                    className="hover:bg-red-500 hover:text-white"
                    onClick={() => {
                      const nextFiles = selectedAttachmentFiles.filter(
                        (_, fileIndex) => fileIndex !== index
                      );
                      setSelectedAttachmentFiles(nextFiles);
                      onAttachmentFilesChange(nextFiles);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : null}

          {existingAttachments.length > 0 ? (
            <div className="space-y-1">
              <p className="text-xs font-medium text-foreground">Existing attachments</p>
              {existingAttachments.map((attachment, index) => {
                return (
                  <div key={`${lessonId}-existing-attachment-${index}`} className="flex gap-2">
                    {attachment.url ? (
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 truncate text-xs text-primary underline-offset-4 hover:underline"
                      >
                        {attachment.name}
                      </a>
                    ) : (
                      <p className="flex-1 truncate text-xs text-muted-foreground">
                        {attachment.name}
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Remove existing attachment"
                      className="hover:bg-red-500 hover:text-white"
                      onClick={() => {
                        const nextAttachments = attachments.filter(
                          (_, attachmentIndex) => attachmentIndex !== index
                        );
                        form.setValue(
                          `modules.${moduleIndex}.lessons.${lessonIndex}.attachments`,
                          nextAttachments,
                          { shouldDirty: true }
                        );
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <FormField
          control={form.control}
          name={`modules.${moduleIndex}.lessons.${lessonIndex}.isPublished`}
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-muted bg-muted/20 px-3 py-2">
              <div>
                <FormLabel>Publish Lesson</FormLabel>
                <p className="text-xs text-muted-foreground">
                  Make this lesson visible to students
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="button"
          className="w-full gap-2"
          onClick={onSubmitLesson}
          disabled={isSubmitting}
        >
          <BookOpen className="h-4 w-4" />
          {isSubmitting ? "Saving..." : isNewLesson ? "Create Lesson" : "Update Lesson"}
        </Button>
      </CardContent>
    </Card>
  );
}
