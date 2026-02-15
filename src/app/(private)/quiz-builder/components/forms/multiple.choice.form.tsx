"use client";

import type { UseFormReturn } from "react-hook-form";

import type { QuizFormData } from "@/types/quiz-builder";
import { DEFAULT_MULTIPLE_CHOICE_OPTIONS } from "@/constants/quiz-builder";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

type MultipleChoiceFormProps = {
  index: number;
  form: UseFormReturn<QuizFormData>;
};

export default function MultipleChoiceForm({ index, form }: MultipleChoiceFormProps) {
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
        name={`questions.${index}.correctOptionIndex`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Answer Options</FormLabel>
            <FormControl>
              <RadioGroup
                value={String(field.value)}
                onValueChange={(value) => field.onChange(Number(value))}
                className="gap-3"
              >
                {DEFAULT_MULTIPLE_CHOICE_OPTIONS.map((placeholder, optionIndex) => (
                  <div key={placeholder} className="flex items-center gap-3">
                    <RadioGroupItem
                      value={String(optionIndex)}
                      aria-label={`Option ${optionIndex + 1}`}
                    />
                    <FormField
                      control={form.control}
                      name={`questions.${index}.options.${optionIndex}`}
                      render={({ field: optionField }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              className="bg-white"
                              placeholder={placeholder}
                              {...optionField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
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
