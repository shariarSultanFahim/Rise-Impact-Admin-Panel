"use client";

import { useMemo, useState } from "react";

import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";

import type {
  QuizDetail,
  QuizFormData,
  QuizOption,
  QuizQuestionType
} from "@/types/quiz-builder-manage";

import {
  useCreateQuiz,
  useDeleteQuiz,
  useGetQuizCourseOptions,
  useGetQuizDetails,
  useGetQuizzes,
  useUpdateQuiz
} from "@/lib/api/quiz-builder";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  defaultFormValues,
  defaultQuestion,
  getOptionIdByIndex,
  mapQuizDetailToForm,
  normalizeOptionsAfterRemoval,
  quizFormSchema,
  toPayload,
  type EditorMode
} from "./quiz-builder/quiz-builder.helpers";
import QuizDeleteDialog from "./quiz-builder/QuizDeleteDialog";
import QuizDetailPanel from "./quiz-builder/QuizDetailPanel";
import QuizEditorPanel from "./quiz-builder/QuizEditorPanel";
import QuizListPanel from "./quiz-builder/QuizListPanel";

export default function QuizBuilderForm() {
  const [editorMode, setEditorMode] = useState<EditorMode>("list");
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<{ id: string; title: string } | null>(null);

  const [queryParams, setQueryParams] = useState({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 400);

  const quizListParams = useMemo(
    () => ({
      page: queryParams.page,
      limit: queryParams.limit,
      searchTerm: debouncedSearchTerm || undefined
    }),
    [debouncedSearchTerm, queryParams.limit, queryParams.page]
  );

  const { data: quizListResponse, isPending: isListPending } = useGetQuizzes(quizListParams);
  const { data: courseOptionsResponse } = useGetQuizCourseOptions(editorMode !== "list");

  const { data: quizDetailsResponse, isPending: isDetailsPending } = useGetQuizDetails(
    selectedQuizId ?? undefined,
    Boolean(selectedQuizId)
  );

  const createQuizMutation = useCreateQuiz();
  const updateQuizMutation = useUpdateQuiz();
  const deleteQuizMutation = useDeleteQuiz();

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: defaultFormValues
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "questions"
  });

  const quizzes = quizListResponse?.data ?? [];
  const pagination = quizListResponse?.pagination;
  const selectedQuiz = quizDetailsResponse?.data;
  const courseOptions = courseOptionsResponse?.data ?? [];
  const totalPages = pagination?.totalPage ?? 1;

  const isSaving = createQuizMutation.isPending || updateQuizMutation.isPending;

  const handleStartCreate = () => {
    setEditorMode("create");
    setEditingQuizId(null);
    form.reset(defaultFormValues);
  };

  const handleSelectQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    setEditorMode("list");
    setEditingQuizId(null);
  };

  const handleEditQuiz = (quiz: QuizDetail) => {
    setEditorMode("edit");
    setEditingQuizId(quiz._id);
    setSelectedQuizId(quiz._id);
    form.reset(mapQuizDetailToForm(quiz));
  };

  const handleEditRequestFromList = (quizId: string) => {
    if (selectedQuiz?._id !== quizId) {
      handleSelectQuiz(quizId);
      return;
    }

    handleEditQuiz(selectedQuiz);
  };

  const handleAddQuestion = (type: QuizQuestionType) => {
    append(defaultQuestion(type));
  };

  const handleTypeChange = (questionIndex: number, type: QuizQuestionType) => {
    const current = form.getValues(`questions.${questionIndex}`);

    if (type === "TRUE_FALSE") {
      form.setValue(
        `questions.${questionIndex}`,
        {
          ...current,
          type,
          options: [
            { optionId: "T", text: "True", isCorrect: true },
            { optionId: "F", text: "False", isCorrect: false }
          ]
        },
        { shouldDirty: true }
      );
      return;
    }

    const nextOptions: QuizOption[] =
      current.options.length >= 2
        ? current.options.map((option, index) => ({
            ...option,
            optionId: getOptionIdByIndex(index)
          }))
        : [
            { optionId: "A", text: "", isCorrect: true },
            { optionId: "B", text: "", isCorrect: false }
          ];

    form.setValue(
      `questions.${questionIndex}`,
      {
        ...current,
        type,
        options: nextOptions
      },
      { shouldDirty: true }
    );
  };

  const handleSelectCorrectOption = (questionIndex: number, optionIndex: number) => {
    const options = form.getValues(`questions.${questionIndex}.options`);

    const nextOptions = options.map((option, index) => ({
      ...option,
      isCorrect: index === optionIndex
    }));

    form.setValue(`questions.${questionIndex}.options`, nextOptions, { shouldDirty: true });
  };

  const handleAddOption = (questionIndex: number) => {
    const options = form.getValues(`questions.${questionIndex}.options`);

    const nextOption: QuizOption = {
      optionId: getOptionIdByIndex(options.length),
      text: "",
      isCorrect: false
    };

    form.setValue(`questions.${questionIndex}.options`, [...options, nextOption], {
      shouldDirty: true
    });
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const options = form.getValues(`questions.${questionIndex}.options`);

    if (options.length <= 2) {
      return;
    }

    const normalized = normalizeOptionsAfterRemoval(options, optionIndex);
    form.setValue(`questions.${questionIndex}.options`, normalized, { shouldDirty: true });
  };

  const handleMoveQuestionUp = (questionIndex: number) => {
    if (questionIndex <= 0) {
      return;
    }

    move(questionIndex, questionIndex - 1);
  };

  const handleMoveQuestionDown = (questionIndex: number) => {
    if (questionIndex >= fields.length - 1) {
      return;
    }

    move(questionIndex, questionIndex + 1);
  };

  const handleCancelEditing = () => {
    setEditorMode("list");
    setEditingQuizId(null);
    form.reset(defaultFormValues);
  };

  const handleSubmit = async (values: QuizFormData) => {
    const payload = toPayload(values);

    try {
      if (editorMode === "edit" && editingQuizId) {
        const response = await updateQuizMutation.mutateAsync({
          quizId: editingQuizId,
          payload
        });

        toast.success(response.message || "Quiz updated successfully.");
        setSelectedQuizId(response.data._id);
      } else {
        const response = await createQuizMutation.mutateAsync(payload);

        toast.success(response.message || "Quiz created successfully.");
        setSelectedQuizId(response.data._id);
      }

      setEditorMode("list");
      setEditingQuizId(null);
      form.reset(defaultFormValues);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save quiz.";
      toast.error(message);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!quizToDelete) {
      return;
    }

    try {
      const response = await deleteQuizMutation.mutateAsync({ quizId: quizToDelete.id });
      toast.success(response.message || "Quiz deleted successfully.");

      if (selectedQuizId === quizToDelete.id) {
        setSelectedQuizId(null);
      }

      setQuizToDelete(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete quiz.";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardContent className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Quiz Builder</h1>
            <p className="text-sm text-muted-foreground">
              Create, view, edit, and manage quizzes with single-save updates.
            </p>
          </div>
          <Button onClick={handleStartCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Quiz
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <QuizListPanel
          quizzes={quizzes}
          isListPending={isListPending}
          selectedQuizId={selectedQuizId}
          selectedQuiz={selectedQuiz}
          searchTerm={searchTerm}
          pagination={pagination}
          totalPages={totalPages}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setQueryParams((prev) => ({ ...prev, page: 1 }));
          }}
          onSelectQuiz={handleSelectQuiz}
          onRequestEdit={handleEditRequestFromList}
          onRequestDelete={setQuizToDelete}
          onPageChange={(page) => setQueryParams((prev) => ({ ...prev, page }))}
        />

        {editorMode === "list" ? (
          <QuizDetailPanel
            selectedQuizId={selectedQuizId}
            selectedQuiz={selectedQuiz}
            isDetailsPending={isDetailsPending}
            onEdit={handleEditQuiz}
            onDelete={setQuizToDelete}
          />
        ) : (
          <QuizEditorPanel
            mode={editorMode}
            form={form}
            fields={fields}
            courseOptions={courseOptions}
            isSaving={isSaving}
            onSubmit={handleSubmit}
            onCancel={handleCancelEditing}
            onAddQuestion={handleAddQuestion}
            onTypeChange={handleTypeChange}
            onRemoveQuestion={remove}
            onMoveQuestionUp={handleMoveQuestionUp}
            onMoveQuestionDown={handleMoveQuestionDown}
            onAddOption={handleAddOption}
            onRemoveOption={handleRemoveOption}
            onSelectCorrectOption={handleSelectCorrectOption}
          />
        )}
      </div>

      <QuizDeleteDialog
        quizToDelete={quizToDelete}
        isDeleting={deleteQuizMutation.isPending}
        onClose={() => setQuizToDelete(null)}
        onConfirm={handleDeleteQuiz}
      />
    </div>
  );
}
