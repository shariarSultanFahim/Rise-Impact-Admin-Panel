"use client";

import type { UseFormReturn } from "react-hook-form";

import type { QuizFormData } from "@/types/quiz-builder";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

type TrueFalseFormProps = {
  index: number;
  form: UseFormReturn<QuizFormData>;
};

export default function TrueFalseForm({ index, form }: TrueFalseFormProps) {
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

      <FormField
        control={form.control}
        name={`questions.${index}.correctAnswer`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Correct Answer</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value ? "true" : "false"}
                onValueChange={(value) => field.onChange(value === "true")}
                className="gap-3"
              >
                <label className="flex items-center gap-3 text-sm font-medium">
                  <RadioGroupItem value="true" aria-label="true-option" />
                  True
                </label>
                <label className="flex items-center gap-3 text-sm font-medium">
                  <RadioGroupItem value="false" aria-label="false-option" />
                  False
                </label>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`questions.${index}.explanation`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Explanation (Optional)</FormLabel>
            <FormControl>
              <Textarea
                className="bg-white"
                placeholder="Provide an explanation for the correct answer..."
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
