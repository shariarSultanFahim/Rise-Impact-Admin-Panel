"use client";

import { useMemo } from "react"; // Import useMemo
import Image from "next/image";

import { UploadIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { CreateBadgeFormData, CreateBadgeSchema } from "../schema/create.badge.schema";

type CreateBadgeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateBadgeModal({ open, onOpenChange }: CreateBadgeModalProps) {
  const form = useForm<CreateBadgeFormData>({
    resolver: zodResolver(CreateBadgeSchema),
    defaultValues: {
      name: "",
      description: "",
      criteria: "",
      icon: undefined
    }
  });

  // Watch the icon field to get the file object
  const iconFile = useWatch({
    control: form.control,
    name: "icon"
  });

  // Create a preview URL safely using useMemo
  const previewUrl = useMemo(() => {
    if (iconFile instanceof File) {
      return URL.createObjectURL(iconFile);
    }
    return null;
  }, [iconFile]);

  const handleSubmit = async (values: CreateBadgeFormData) => {
    try {
      // TODO: values.icon is now a File object.
      console.log("Submitting", values);

      await Promise.resolve(values);
      toast.success("Badge ready to be created.");
      onOpenChange(false);
      form.reset();
    } catch {
      toast.error("Unable to save badge. Try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card sm:max-w-lg">
        <DialogHeader className="pb-5">
          <DialogTitle>Create New Badge</DialogTitle>
          <DialogDescription>Add a new badge to reward student milestones.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* ... Name, Description, Criteria fields remain the same ... */}
          <div className="space-y-2">
            <Label htmlFor="badge-name">Badge Name</Label>
            <Input
              id="badge-name"
              className="bg-white"
              placeholder="e.g., Super Learner"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="badge-description">Description</Label>
            <Textarea
              id="badge-description"
              placeholder="Brief description of the badge"
              className="min-h-[90px] bg-white"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="badge-criteria">Unlock Criteria</Label>
            <Textarea
              id="badge-criteria"
              placeholder="What students need to do to earn this badge"
              className="min-h-[90px] bg-white"
              {...form.register("criteria")}
            />
            {form.formState.errors.criteria && (
              <p className="text-sm text-red-500">{form.formState.errors.criteria.message}</p>
            )}
          </div>

          {/* --- FIXED ICON SECTION --- */}
          <div className="space-y-2">
            <Label htmlFor="badge-icon">Badge Icon</Label>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-md border border-input bg-white px-3 py-2">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Badge icon preview"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                ) : null}
                <span className="text-sm text-muted-foreground">
                  {iconFile ? iconFile.name : "No icon selected"}
                </span>
              </div>
              <input
                type="file"
                id="icon-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // FIX: Set the File object directly, not the base64 string
                    form.setValue("icon", file, { shouldValidate: true });
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => document.getElementById("icon-upload")?.click()}
              >
                <UploadIcon className="size-4" />
              </Button>
            </div>
            {form.formState.errors.icon && (
              <p className="text-sm text-red-500">{form.formState.errors.icon.message}</p>
            )}
          </div>
          {/* ------------------------- */}

          <DialogFooter>
            <Button
              type="submit"
              variant="default"
              className="w-full bg-secondary"
              disabled={form.formState.isSubmitting}
            >
              Create Badge
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
