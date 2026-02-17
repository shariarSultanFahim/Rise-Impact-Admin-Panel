"use client";

import { useCallback, useState } from "react";

import { ChevronDown, PlusIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { QuestionType, QuizFormData } from "@/types/quiz-builder";
import {
  COURSE_OPTIONS,
  QUESTION_TYPE_OPTIONS,
  QUIZ_DEFAULT_SETTINGS
} from "@/constants/quiz-builder";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import DescriptiveForm from "./forms/descriptive.form";
import MultipleChoiceForm from "./forms/multiple.choice.form";
import { quizSchema } from "./forms/schema/quiz.schema";
import TrueFalseForm from "./forms/true.false.form";

function createDefaultQuestion(type: QuestionType): QuizFormData["questions"][number] {
  if (type === "multiple-choice") {
    return {
      type,
      text: "",
      explanation: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0
    };
  }

  if (type === "true-false") {
    return {
      type,
      text: "",
      explanation: "",
      correctAnswer: true
    };
  }

  return {
    type,
    text: "",
    explanation: ""
  };
}

type QuestionCardProps = {
  index: number;
  form: UseFormReturn<QuizFormData>;
  onTypeChange: (index: number, nextType: QuestionType) => void;
};

function QuestionCard({ index, form, onTypeChange }: QuestionCardProps) {
  const questionType = useWatch({
    control: form.control,
    name: `questions.${index}.type`
  });
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const typeLabel = QUESTION_TYPE_OPTIONS.find((opt) => opt.value === questionType)?.label;

  return (
    <Card className="border-muted/60">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-base font-semibold">Question {index + 1}</CardTitle>
        <FormField
          control={form.control}
          name={`questions.${index}.type`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DropdownMenu open={typeDropdownOpen} onOpenChange={setTypeDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-48 gap-2 border-primary">
                      {typeLabel || "Select option"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuRadioGroup
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        onTypeChange(index, value as QuestionType);
                        setTypeDropdownOpen(false);
                      }}
                    >
                      {QUESTION_TYPE_OPTIONS.map((option) => (
                        <DropdownMenuRadioItem key={option.value} value={option.value}>
                          {option.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
            </FormItem>
          )}
        />
      </CardHeader>
      <CardContent className="space-y-5">
        {questionType === "multiple-choice" ? (
          <MultipleChoiceForm index={index} form={form} />
        ) : null}
        {questionType === "true-false" ? <TrueFalseForm index={index} form={form} /> : null}
        {questionType === "descriptive" ? <DescriptiveForm index={index} form={form} /> : null}
      </CardContent>
    </Card>
  );
}

export default function QuizBuilderForm() {
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema as never),
    defaultValues: {
      settings: QUIZ_DEFAULT_SETTINGS,
      questions: [createDefaultQuestion("multiple-choice")]
    }
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "questions"
  });

  const handleTypeChange = useCallback(
    (index: number, nextType: QuestionType) => {
      const currentQuestion = form.getValues(`questions.${index}`);
      const nextQuestion = createDefaultQuestion(nextType);

      form.setValue(
        `questions.${index}`,
        {
          ...nextQuestion,
          text: currentQuestion.text ?? "",
          explanation: currentQuestion.explanation ?? ""
        },
        { shouldDirty: true, shouldTouch: true }
      );
    },
    [form]
  );

  const handleAddQuestion = (type: QuestionType) => {
    append(createDefaultQuestion(type));
  };

  const onSubmit = (values: QuizFormData) => {
    try {
      //TODO: Implement API Here
      quizSchema.parse(values);
      toast.success("Quiz saved successfully!");
      console.log("Quiz form data", values);
    } catch {
      console.log("Validation errors", form.formState.errors);
    } finally {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Quiz Builder</h1>
            <p className="text-sm text-muted-foreground">
              Create assessments to test student knowledge.
            </p>
          </div>
          <Button type="submit" className="gap-2 bg-secondary">
            Save Quiz
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Quiz Settings</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-6 md:flex-row">
              <FormField
                control={form.control}
                name="settings.title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Quiz Title</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="e.g., Communication Skills Assessment"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="settings.courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <DropdownMenu open={courseDropdownOpen} onOpenChange={setCourseDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full gap-2 border-primary">
                            {selectedCourseId
                              ? COURSE_OPTIONS.find((c) => c.value === selectedCourseId)?.label
                              : "Select a course"}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-fit">
                          <DropdownMenuRadioGroup
                            value={selectedCourseId}
                            onValueChange={(value) => {
                              setSelectedCourseId(value);
                              field.onChange(value);
                              setCourseDropdownOpen(false);
                            }}
                          >
                            {COURSE_OPTIONS.map((course) => (
                              <DropdownMenuRadioItem key={course.value} value={course.value}>
                                {course.label}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-6 md:flex-row">
              <FormField
                control={form.control}
                name="settings.timeLimit"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Time Limit (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
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
                name="settings.passingScore"
                render={({ field }) => (
                  <FormItem className="w-full">
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
          </CardContent>
        </Card>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <QuestionCard
              key={field.id}
              index={index}
              form={form}
              onTypeChange={handleTypeChange}
            />
          ))}
        </div>

        <Card>
          <CardContent className="flex flex-wrap items-center gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1 gap-2 border-primary"
              onClick={() => handleAddQuestion("multiple-choice")}
            >
              <PlusIcon className="size-4" />
              Add Multiple Choice
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 gap-2 border-primary"
              onClick={() => handleAddQuestion("true-false")}
            >
              <PlusIcon className="size-4" />
              Add True/False
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 gap-2 border-primary"
              onClick={() => handleAddQuestion("descriptive")}
            >
              <PlusIcon className="size-4" />
              Add Descriptive
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
