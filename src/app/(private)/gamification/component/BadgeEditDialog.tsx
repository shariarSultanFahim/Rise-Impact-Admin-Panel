"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import zod from "zod";

import { useUpdateGamificationBadge } from "@/lib/api/gamification/update-gamification-badge";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { GamificationBadgeItem } from "@/types";

const updateBadgeSchema = zod.object({
  description: zod.string().trim().min(1, "Description is required").max(500),
  threshold: zod.number().int().min(1, "Threshold must be at least 1"),
  isActive: zod.boolean()
});

type UpdateBadgeFormValues = zod.infer<typeof updateBadgeSchema>;

type BadgeEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badge: GamificationBadgeItem | null;
};

export default function BadgeEditDialog({ open, onOpenChange, badge }: BadgeEditDialogProps) {
  const { mutateAsync: updateBadge, isPending: isUpdating } = useUpdateGamificationBadge();
  const form = useForm<UpdateBadgeFormValues>({
    resolver: zodResolver(updateBadgeSchema),
    defaultValues: {
      description: "",
      threshold: 1,
      isActive: true
    }
  });

  useEffect(() => {
    if (!badge) {
      return;
    }

    form.reset({
      description: badge.description ?? "",
      threshold: badge.criteria.threshold,
      isActive: badge.isActive
    });
  }, [badge, form]);

  const handleSubmit = async (values: UpdateBadgeFormValues) => {
    if (!badge) {
      return;
    }

    try {
      await updateBadge({
        badgeId: badge._id,
        payload: {
          description: values.description,
          criteria: {
            threshold: values.threshold
          },
          isActive: values.isActive
        }
      });

      toast.success("Badge updated successfully.");
      onOpenChange(false);
    } catch {
      toast.error("Unable to update badge. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Badge</DialogTitle>
          <DialogDescription>
            Update description, threshold, and active status for this seeded badge.
          </DialogDescription>
        </DialogHeader>

        {badge ? (
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="badge-name">Badge Name</Label>
              <Input id="badge-name" value={badge.name} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge-description">Description</Label>
              <Textarea
                id="badge-description"
                className="min-h-[120px]"
                placeholder="Awarded when..."
                {...form.register("description")}
              />
              {form.formState.errors.description ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge-threshold">Criteria Threshold</Label>
              <Input
                id="badge-threshold"
                type="number"
                min={1}
                {...form.register("threshold", { valueAsNumber: true })}
              />
              {form.formState.errors.threshold ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.threshold.message}
                </p>
              ) : null}
            </div>

            <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
              <div>
                <p className="text-sm font-medium text-foreground">Active Badge</p>
                <p className="text-xs text-muted-foreground">
                  Inactive badges are excluded from auto-evaluation.
                </p>
              </div>
              <Controller
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Toggle badge active status"
                  />
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
