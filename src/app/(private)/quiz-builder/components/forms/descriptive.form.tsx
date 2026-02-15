"use client";

import type { UseFormReturn } from "react-hook-form";

import type { QuizFormData } from "@/types/quiz-builder";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type DescriptiveFormProps = {
  index: number;
  form: UseFormReturn<QuizFormData>;
};

export default function DescriptiveForm({ index, form }: DescriptiveFormProps) {
  return (
    <div className="space-y-5">
      <FormField
        control={form.control}
        name={`questions.${index}.text`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Question Text</FormLabel>
            <FormControl>
              <Textarea className="bg-white" placeholder="Enter your question here..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="rounded-md border border-dashed bg-muted/30 p-3 text-sm text-muted-foreground">
        Descriptive questions require manual grading. Students will provide a written answer.
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
                placeholder="Provide guidance for reviewers..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
