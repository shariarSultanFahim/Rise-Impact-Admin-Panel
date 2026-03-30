"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import type { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import type { CourseOption, QuizFormData, QuizQuestionType } from "@/types/quiz-builder-manage";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import QuestionEditor from "./QuestionEditor";
import type { EditorMode } from "./quiz-builder.helpers";

interface QuizEditorPanelProps {
  mode: EditorMode;
  form: UseFormReturn<QuizFormData>;
  fields: UseFieldArrayReturn<QuizFormData, "questions", "id">["fields"];
  editingQuizId?: string | null;
  courseOptions: CourseOption[];
  isSaving: boolean;
  onSubmit: (values: QuizFormData) => void;
  onCancel: () => void;
  onRequestDelete?: (quiz: { id: string; title: string }) => void;
  onAddQuestion: (type: QuizQuestionType) => void;
  onTypeChange: (index: number, type: QuizQuestionType) => void;
  onRemoveQuestion: (index: number) => void;
  onMoveQuestionUp: (index: number) => void;
  onMoveQuestionDown: (index: number) => void;
  onAddOption: (index: number) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  onSelectCorrectOption: (questionIndex: number, optionIndex: number) => void;
}

export default function QuizEditorPanel({
  mode,
  form,
  fields,
  editingQuizId,
  courseOptions,
  isSaving,
  onSubmit,
  onCancel,
  onRequestDelete,
  onAddQuestion,
  onTypeChange,
  onRemoveQuestion,
  onMoveQuestionUp,
  onMoveQuestionDown,
  onAddOption,
  onRemoveOption,
  onSelectCorrectOption
}: QuizEditorPanelProps) {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>{mode === "create" ? "Create Quiz" : "Edit Quiz"}</CardTitle>
        <CardDescription>Full current state will be saved in a single API request.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input className="bg-white" placeholder="Module 1 Quiz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courseOptions.map((course) => (
                          <SelectItem key={course._id} value={course._id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea className="bg-white" rows={3} placeholder="Quiz summary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Limit (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={180}
                        step={1}
                        className="bg-white"
                        value={field.value}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passingScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passing Score (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        className="bg-white"
                        value={field.value}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="shuffleQuestions"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border border-border p-3">
                    <FormLabel className="mb-0">Shuffle Questions</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shuffleOptions"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border border-border p-3">
                    <FormLabel className="mb-0">Shuffle Options</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showResults"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border border-border p-3">
                    <FormLabel className="mb-0">Show Results</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Questions</h3>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => onAddQuestion("MCQ")}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add MCQ
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onAddQuestion("TRUE_FALSE")}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add True/False
                  </Button>
                </div>
              </div>

              {fields.length === 0 ? (
                <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                  No question yet. You can create quiz now and add questions later.
                </p>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <QuestionEditor
                      key={field.id}
                      index={index}
                      form={form}
                      onTypeChange={onTypeChange}
                      onRemove={onRemoveQuestion}
                      onMoveUp={onMoveQuestionUp}
                      onMoveDown={onMoveQuestionDown}
                      onAddOption={onAddOption}
                      onRemoveOption={onRemoveOption}
                      onSelectCorrectOption={onSelectCorrectOption}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onAddQuestion("MCQ")}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add MCQ
                </Button>
                <Button type="button" variant="outline" onClick={() => onAddQuestion("TRUE_FALSE")}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add True/False
                </Button>
              </div>
              {mode === "edit" && editingQuizId && onRequestDelete ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    onRequestDelete({
                      id: editingQuizId,
                      title: form.getValues("title") || "this quiz"
                    })
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Quiz
                </Button>
              ) : null}
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : mode === "create" ? (
                  "Create Quiz"
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
