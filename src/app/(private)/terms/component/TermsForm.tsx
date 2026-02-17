"use client";

import { useEffect, useMemo, useState } from "react";

import { ChevronDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import type { LegalDocumentsData } from "@/types/legal-document";

import Editor from "@/components/text-editor/Editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

import { termsSchema, type TermsFormData } from "../schema/terms.schema";

type TermsFormProps = {
  data: LegalDocumentsData;
};

const DEFAULT_TYPE = "terms-and-conditions";

export default function TermsForm({ data }: TermsFormProps) {
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
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
                    <DropdownMenu open={typeDropdownOpen} onOpenChange={setTypeDropdownOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-auto gap-2 border-primary bg-white">
                          {data.options.find((opt) => opt.id === field.value)?.label ||
                            "Select document type"}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-full">
                        <DropdownMenuRadioGroup
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setTypeDropdownOpen(false);
                          }}
                        >
                          {data.options.map((option) => (
                            <DropdownMenuRadioItem key={option.id} value={option.id}>
                              <div className="flex flex-col items-start">
                                <p className="text-sm font-medium">{option.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  {option.description}
                                </p>
                              </div>
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
