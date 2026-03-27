"use client";

import { useEffect, useMemo, useState } from "react";

import { SendIcon, StarHalfIcon, StarIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { useDeleteFeedback } from "@/lib/api/feedback/delete-feedback";
import { useGetAdminFeedbackById } from "@/lib/api/feedback/get-admin-feedback-by-id";
import { useRespondFeedback } from "@/lib/api/feedback/respond-feedback";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const MAX_RATING = 5;

type FeedbackModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFeedbackId: string | null;
};

export default function FeedbackModal({
  open,
  onOpenChange,
  selectedFeedbackId
}: FeedbackModalProps) {
  const [personalizedFeedback, setPersonalizedFeedback] = useState("");

  const { data: detailResponse, isPending: isDetailPending } = useGetAdminFeedbackById(
    selectedFeedbackId ?? undefined,
    open
  );
  const { mutateAsync: respondFeedback, isPending: isResponding } = useRespondFeedback();
  const { mutateAsync: deleteFeedback, isPending: isDeleting } = useDeleteFeedback();

  const submission = detailResponse?.data;

  useEffect(() => {
    if (!submission?.adminResponse) {
      return;
    }

    setPersonalizedFeedback(submission.adminResponse);
  }, [submission?.adminResponse]);

  const ratingStars = useMemo(() => {
    if (!submission?.rating) {
      return null;
    }

    const fullStars = Math.floor(submission.rating);
    const hasHalf = submission.rating % 1 !== 0;
    const stars = Array.from({ length: MAX_RATING }).map((_, index) => {
      if (index < fullStars) {
        return <StarIcon key={`star-${index}`} className="size-4 fill-amber-400 text-amber-400" />;
      }

      if (index === fullStars && hasHalf) {
        return (
          <StarHalfIcon key={`star-${index}`} className="size-4 fill-amber-400 text-amber-400" />
        );
      }

      return <StarIcon key={`star-${index}`} className="size-4 text-muted-foreground" />;
    });

    return <div className="flex items-center gap-1">{stars}</div>;
  }, [submission?.rating]);

  const initials = useMemo(() => {
    if (!submission?.student?.name) {
      return "";
    }

    return submission.student.name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [submission]);

  const handleRespond = async () => {
    if (!selectedFeedbackId) {
      return;
    }

    const trimmedResponse = personalizedFeedback.trim();

    if (!trimmedResponse) {
      toast.error("Please enter an admin response.");
      return;
    }

    try {
      await respondFeedback({
        feedbackId: selectedFeedbackId,
        payload: {
          adminResponse: trimmedResponse
        }
      });

      toast.success("Response added successfully.");
    } catch {
      toast.error("Unable to submit response. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!selectedFeedbackId) {
      return;
    }

    const isConfirmed = window.confirm("Delete this feedback permanently?");

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteFeedback({ feedbackId: selectedFeedbackId });
      toast.success("Feedback deleted successfully.");
      onOpenChange(false);
    } catch {
      toast.error("Unable to delete feedback. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-xl flex-col gap-5 bg-card">
        <DialogHeader>
          <DialogTitle>Feedback Details</DialogTitle>
          <DialogDescription>Review and respond to student feedback.</DialogDescription>
        </DialogHeader>

        {isDetailPending ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : submission ? (
          <>
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-muted/10 p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={
                      submission.student.profilePicture ??
                      `https://api.dicebear.com/9.x/pixel-art/svg?seed=${submission.student.name}`
                    }
                    alt={submission.student.name}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">{submission.student.name}</p>
                  <p className="text-xs text-muted-foreground">{submission.student.email}</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(submission.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Course</p>
              <div className="rounded-lg border border-border/60 bg-muted/10 p-3 text-sm text-muted-foreground">
                {submission.course.title}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Review</p>
              <div className="space-y-2 rounded-lg border border-border/60 bg-muted/10 p-3">
                {ratingStars ? ratingStars : null}
                <p className="text-sm text-muted-foreground">{submission.review}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Admin Response</p>
              <Textarea
                placeholder="Write a response for the student..."
                value={personalizedFeedback}
                onChange={(event) => setPersonalizedFeedback(event.target.value)}
                className="min-h-[110px]"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={handleDelete}
                disabled={isDeleting || isResponding}
              >
                <Trash2Icon className="size-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
              <Button
                type="button"
                className="gap-2"
                onClick={handleRespond}
                disabled={isResponding || isDeleting}
              >
                <SendIcon className="size-4" />
                {isResponding ? "Saving..." : "Respond"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="rounded-md border border-border/60 bg-muted/10 p-4 text-sm text-muted-foreground">
            Feedback not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
