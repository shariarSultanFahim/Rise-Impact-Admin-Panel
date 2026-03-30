"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useWatch, type UseFormReturn } from "react-hook-form";

import type { QuizFormData, QuizQuestionType } from "@/types/quiz-builder-manage";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { QUESTION_TYPE_OPTIONS } from "./quiz-builder.helpers";

interface QuestionEditorProps {
  index: number;
  form: UseFormReturn<QuizFormData>;
  onTypeChange: (index: number, type: QuizQuestionType) => void;
  onRemove: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onAddOption: (index: number) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  onSelectCorrectOption: (questionIndex: number, optionIndex: number) => void;
}

export default function QuestionEditor({
  index,
  form,
  onTypeChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddOption,
  onRemoveOption,
  onSelectCorrectOption
}: QuestionEditorProps) {
  const question = useWatch({
    control: form.control,
    name: `questions.${index}`
  });

  if (!question) {
    return null;
  }

  return (
    <Card className="border-border/70">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base">Question {index + 1}</CardTitle>
          <div className="flex items-center gap-2">
            <Button type="button" size="icon" variant="outline" onClick={() => onMoveUp(index)}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="outline" onClick={() => onMoveDown(index)}>
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="destructive" onClick={() => onRemove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name={`questions.${index}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Type</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => onTypeChange(index, value as QuizQuestionType)}
                >
                  <FormControl>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {QUESTION_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`questions.${index}.marks`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marks</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
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

        <FormField
          control={form.control}
          name={`questions.${index}.text`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Text</FormLabel>
              <FormControl>
                <Textarea
                  className="bg-white"
                  rows={3}
                  placeholder="Type your question"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel>Options</FormLabel>
            {question.type === "MCQ" ? (
              <Button type="button" variant="outline" size="sm" onClick={() => onAddOption(index)}>
                <Plus className="mr-1 h-4 w-4" />
                Add Option
              </Button>
            ) : null}
          </div>

          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div key={`${option.optionId}-${optionIndex}`} className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={option.isCorrect ? "default" : "outline"}
                  onClick={() => onSelectCorrectOption(index, optionIndex)}
                  className="min-w-10"
                >
                  {option.optionId}
                </Button>
                <FormField
                  control={form.control}
                  name={`questions.${index}.options.${optionIndex}.text`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          className="bg-white"
                          {...field}
                          readOnly={question.type === "TRUE_FALSE"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {question.type === "MCQ" ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => onRemoveOption(index, optionIndex)}
                    disabled={question.options.length <= 2}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
          <FormField
            control={form.control}
            name={`questions.${index}.options`}
            render={() => <FormMessage />}
          />
        </div>

        <FormField
          control={form.control}
          name={`questions.${index}.explanation`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Explanation (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  className="bg-white"
                  rows={2}
                  placeholder="Add explanation for the correct answer"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
