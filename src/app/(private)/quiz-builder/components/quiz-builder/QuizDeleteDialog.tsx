"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface QuizDeleteDialogProps {
  quizToDelete: { id: string; title: string } | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function QuizDeleteDialog({
  quizToDelete,
  isDeleting,
  onClose,
  onConfirm
}: QuizDeleteDialogProps) {
  return (
    <Dialog open={Boolean(quizToDelete)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="space-y-4 bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Quiz</DialogTitle>
          <DialogDescription>
            This will permanently delete quiz attempts linked to
            <span className="font-medium text-foreground"> {quizToDelete?.title}</span>. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
