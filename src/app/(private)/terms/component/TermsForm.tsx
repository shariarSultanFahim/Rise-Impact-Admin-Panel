"use client";

import { useEffect, useMemo, useState } from "react";

import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { useCreateLegal } from "@/lib/api/legal/create-legal";
import { useDeleteLegal } from "@/lib/api/legal/delete-legal";
import { useGetLegalDetails } from "@/lib/api/legal/details-legal";
import { useGetAllLegal } from "@/lib/api/legal/get-all-legal";
import { useUpdateLegal } from "@/lib/api/legal/update-legal";

import Editor from "@/components/text-editor/Editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
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

import {
  addLegalSchema,
  termsSchema,
  type AddLegalFormData,
  type TermsFormData
} from "../schema/terms.schema";

export default function TermsForm() {
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const form = useForm<TermsFormData>({
    resolver: zodResolver(termsSchema),
    defaultValues: {
      slug: "",
      content: ""
    }
  });

  const addLegalForm = useForm<AddLegalFormData>({
    resolver: zodResolver(addLegalSchema),
    defaultValues: {
      title: ""
    }
  });

  const selectedSlug = useWatch({
    control: form.control,
    name: "slug"
  });

  const getAllLegalQuery = useGetAllLegal();
  const detailsLegalQuery = useGetLegalDetails(selectedSlug || undefined);
  const createLegalMutation = useCreateLegal();
  const deleteLegalMutation = useDeleteLegal();
  const updateLegalMutation = useUpdateLegal();

  const legalOptions = useMemo(
    () => getAllLegalQuery.data?.data ?? [],
    [getAllLegalQuery.data?.data]
  );

  useEffect(() => {
    if (legalOptions.length === 0) {
      if (selectedSlug) {
        form.setValue("slug", "");
      }
      form.setValue("content", "");
      return;
    }

    const hasSelectedDocument = legalOptions.some((option) => option.slug === selectedSlug);

    if (!selectedSlug || !hasSelectedDocument) {
      form.setValue("slug", legalOptions[0].slug);
    }
  }, [form, legalOptions, selectedSlug]);

  useEffect(() => {
    const nextContent = detailsLegalQuery.data?.data.content ?? "";
    form.setValue("content", nextContent, { shouldValidate: true });
  }, [detailsLegalQuery.data?.data.content, form]);

  const onSubmit = async (values: TermsFormData) => {
    try {
      const documentDetails = detailsLegalQuery.data?.data;
      if (!documentDetails) {
        toast.error("Select a legal document before saving.");
        return;
      }

      const response = await updateLegalMutation.mutateAsync({
        slug: values.slug,
        content: values.content
      });

      if (response.data.slug !== values.slug) {
        form.setValue("slug", response.data.slug);
      }

      toast.success(response.message || "Legal document updated successfully.");
    } catch {
      toast.error("Unable to save the document. Try again.");
    }
  };

  const handleCreateLegal = async (values: AddLegalFormData) => {
    try {
      const response = await createLegalMutation.mutateAsync({
        title: values.title,
        content: ""
      });

      form.setValue("slug", response.data.slug);
      setIsAddModalOpen(false);
      addLegalForm.reset();
      toast.success(response.message || "Legal page created successfully.");
    } catch {
      toast.error("Unable to create legal page. Try again.");
    }
  };

  const handleDeleteLegal = async () => {
    if (!selectedSlug) {
      toast.error("Select a legal document to delete.");
      return;
    }

    try {
      const selectedIndex = legalOptions.findIndex((option) => option.slug === selectedSlug);
      const remainingOptions = legalOptions.filter((option) => option.slug !== selectedSlug);
      const fallbackIndex = selectedIndex > 0 ? selectedIndex - 1 : 0;
      const nextSlug = remainingOptions[fallbackIndex]?.slug ?? "";

      const response = await deleteLegalMutation.mutateAsync(selectedSlug);

      form.setValue("slug", nextSlug);

      if (!nextSlug) {
        form.setValue("content", "");
      }

      toast.success(response.message || "Legal page deleted successfully.");
    } catch {
      toast.error("Unable to delete legal page. Try again.");
    }
  };

  const selectedDocument = legalOptions.find((option) => option.slug === selectedSlug);
  const isBusy =
    getAllLegalQuery.isPending || detailsLegalQuery.isPending || updateLegalMutation.isPending;

  return (
    <>
      <Card>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <FormLabel>Document Type</FormLabel>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-2"
                          onClick={() => setIsAddModalOpen(true)}
                        >
                          <Plus className="h-4 w-4" />
                          Add Legal
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-2"
                          onClick={handleDeleteLegal}
                          disabled={!selectedSlug || deleteLegalMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <FormControl>
                      <DropdownMenu open={typeDropdownOpen} onOpenChange={setTypeDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-auto gap-2 border-primary bg-white"
                            disabled={legalOptions.length === 0 || getAllLegalQuery.isPending}
                          >
                            {selectedDocument?.title || "Select document type"}
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
                            {legalOptions.map((option) => (
                              <DropdownMenuRadioItem key={option.slug} value={option.slug}>
                                <div className="flex flex-col items-start">
                                  <p className="text-sm font-medium">{option.title}</p>
                                  <p className="text-xs text-muted-foreground">/{option.slug}</p>
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

              <Button type="submit" className="min-w-[160px]" disabled={!selectedSlug || isBusy}>
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) {
            addLegalForm.reset();
          }
        }}
      >
        <DialogContent className="bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Legal Page</DialogTitle>
            <DialogDescription>
              Add a title for the legal page. Content will be created as empty.
            </DialogDescription>
          </DialogHeader>

          <Form {...addLegalForm}>
            <form onSubmit={addLegalForm.handleSubmit(handleCreateLegal)} className="space-y-4">
              <FormField
                control={addLegalForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Legal Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Terms of Service" className="bg-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={createLegalMutation.isPending}
                  className="min-w-[140px]"
                >
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
