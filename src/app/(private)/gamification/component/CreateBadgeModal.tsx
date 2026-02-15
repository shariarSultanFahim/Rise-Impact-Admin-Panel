"use client";

import type { FormEvent } from "react";

import { UploadIcon } from "lucide-react";
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

type CreateBadgeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateBadgeModal({ open, onOpenChange }: CreateBadgeModalProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Replace with API call once badge creation endpoint is available.
    toast.success("Badge ready to be created.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Badge</DialogTitle>
          <DialogDescription>Add a new badge to reward student milestones.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="badge-name">Badge Name</Label>
            <Input id="badge-name" placeholder="e.g., Super Learner" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="badge-description">Description</Label>
            <Textarea
              id="badge-description"
              placeholder="Brief description of the badge"
              className="min-h-[90px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="badge-criteria">Unlock Criteria</Label>
            <Textarea
              id="badge-criteria"
              placeholder="What students need to do to earn this badge"
              className="min-h-[90px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="badge-icon">Badge Icon</Label>
            <div className="flex items-center gap-2">
              <Input id="badge-icon" placeholder="Upload an icon or paste URL" />
              <Button type="button" variant="outline" size="icon">
                <UploadIcon className="size-4" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Create Badge
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
