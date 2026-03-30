"use client";

import { useRef } from "react";
import Image from "next/image";

import { ImageIcon, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import type { CourseForm } from "@/types/course-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CourseDetailsFormProps {
  form: UseFormReturn<CourseForm>;
  onThumbnailChange: (file: File | null) => void;
  thumbnailName: string | null;
  thumbnailPreviewUrl: string | null;
  subheading: string;
}

export default function CourseDetailsForm({
  form,
  onThumbnailChange,
  thumbnailName,
  thumbnailPreviewUrl,
  subheading
}: CourseDetailsFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{subheading}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title *</FormLabel>
                <FormControl>
                  <Input className="bg-white" placeholder="Spoken English" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label>Upload Thumbnail *</Label>
            <div className="rounded-xl border border-dashed border-white bg-white px-4 py-6">
              {thumbnailPreviewUrl ? (
                <figure className="relative">
                  <Image
                    src={thumbnailPreviewUrl}
                    alt="Course thumbnail preview"
                    width={400}
                    height={160}
                    className="h-40 w-full rounded-lg object-cover"
                  />
                  <figcaption className="sr-only">Selected course thumbnail</figcaption>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-2 right-2 bg-white/80 text-foreground shadow-sm"
                    aria-label="Remove thumbnail"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                      onThumbnailChange(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </figure>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Upload your course thumbnail
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Drag and drop or click to browse
                    </p>
                  </div>
                  <Button asChild size="sm" variant="secondary" className="gap-2">
                    <label>
                      Choose File
                      <Input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          onThumbnailChange(file);
                        }}
                      />
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {thumbnailName ?? "Supported: JPEG, PNG (Max 10 MB)"}
                  </p>
                </div>
              )}
            </div>
            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="DRAFT" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">DRAFT</SelectItem>
                      <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                      <SelectItem value="SCHEDULED">SCHEDULED</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              const charCount = field.value.length;

              return (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Description</FormLabel>
                    <span className="text-xs text-muted-foreground">{charCount} characters</span>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description of what students will learn..."
                      className="min-h-[120px] bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
