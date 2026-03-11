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
  prerequisiteOptions: Array<{ id: string; title: string }>;
  isDraft: boolean;
  isSubmitting: boolean;
  onSubmitLesson: () => void;
  onContentFileChange: (file: File | null) => void;
}

export default function LessonEditor({
  form,
  moduleIndex,
  lessonIndex,
  lessonId,
  prerequisiteOptions,
  isDraft,
  isSubmitting,
  onSubmitLesson,
  onContentFileChange
}: LessonEditorProps) {
  const [resourceFile, setResourceFile] = useState<File | null>(null);

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

  useEffect(() => {
    setResourceFile(null);
    onContentFileChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const resourceLabel =
    lessonType === "reading"
      ? "Select Reading Material"
      : lessonType === "assignment"
        ? "Select Assignment File"
        : "Select Video File";

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {isDraft ? "Create New Lesson" : "Edit Lesson"}
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
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
        </div>

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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Attachments</Label>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Add attachment"
              onClick={() =>
                form.setValue(
                  `modules.${moduleIndex}.lessons.${lessonIndex}.attachments`,
                  [...attachments, ""],
                  { shouldDirty: true }
                )
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {attachments.length === 0 ? (
            <p className="text-xs text-muted-foreground">Enter file name (e.g. study-guide.pdf)</p>
          ) : (
            attachments.map((_, index) => (
              <div key={`${lessonId}-attachment-${index}`} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`modules.${moduleIndex}.lessons.${lessonIndex}.attachments.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input className="bg-white" placeholder="Enter file name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="hover:bg-red-500 hover:text-white"
                  size="icon-sm"
                  aria-label="Remove attachment"
                  onClick={() => {
                    const nextAttachments = attachments.filter(
                      (_, itemIndex) => itemIndex !== index
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
            ))
          )}
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
          {isSubmitting ? "Saving..." : isDraft ? "Create Lesson" : "Update Lesson"}
        </Button>
      </CardContent>
    </Card>
  );
}
