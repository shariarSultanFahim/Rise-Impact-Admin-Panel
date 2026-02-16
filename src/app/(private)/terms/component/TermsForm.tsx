"use client";

import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import type { LegalDocumentsData } from "@/types/legal-document";

import Editor from "@/components/text-editor/Editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { termsSchema, type TermsFormData } from "../schema/terms.schema";

type TermsFormProps = {
  data: LegalDocumentsData;
};

const DEFAULT_TYPE = "terms-and-conditions";

export default function TermsForm({ data }: TermsFormProps) {
  const documentsByType = useMemo(() => {
    return data.documents.reduce<Record<string, string>>((accumulator, document) => {
      accumulator[document.type] = document.content;
      return accumulator;
    }, {});
  }, [data.documents]);

  const form = useForm<TermsFormData>({
    resolver: zodResolver(termsSchema),
    defaultValues: {
      type: DEFAULT_TYPE,
      content: documentsByType[DEFAULT_TYPE] ?? ""
    }
  });

  const selectedType = useWatch({
    control: form.control,
    name: "type"
  });

  useEffect(() => {
    const nextContent = documentsByType[selectedType] ?? "";
    form.setValue("content", nextContent, { shouldValidate: true });
  }, [documentsByType, form, selectedType]);

  const onSubmit = async (values: TermsFormData) => {
    try {
      // TODO: Replace with API call for saving terms.
      await Promise.resolve(values);
      toast.success("Legal document updated successfully.");
    } catch {
      toast.error("Unable to save the document. Try again.");
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full bg-white py-6">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.options.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex flex-col items-start">
                              <p className="text-sm font-medium">{option.label}</p>
                              <p className="text-xs text-muted-foreground"> {option.description}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <div>
                      <Editor value={field.value} onChange={field.onChange} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="min-w-[160px]">
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
