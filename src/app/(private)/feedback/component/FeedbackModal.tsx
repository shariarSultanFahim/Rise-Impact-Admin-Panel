"use client";

import { useMemo, useState } from "react";

import { SendIcon, SparklesIcon, StarHalfIcon, StarIcon } from "lucide-react";
import { toast } from "sonner";

import type { FeedbackSubmission } from "@/types/feedback";

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
import { Textarea } from "@/components/ui/textarea";

const MAX_RATING = 5;

type FeedbackModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: FeedbackSubmission | null;
};

export default function FeedbackModal({ open, onOpenChange, submission }: FeedbackModalProps) {
  const [personalizedFeedback, setPersonalizedFeedback] = useState("");

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
    if (!submission?.studentName) {
      return "";
    }

    return submission.studentName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [submission]);

  const handleSend = () => {
    toast.success("Feedback sent successfully.");
    setPersonalizedFeedback("");
    onOpenChange(false);
  };

  const handleSuggest = () => {
    toast.success("Resources suggested successfully.");
    setPersonalizedFeedback("");
    onOpenChange(false);
  };

  if (!submission) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-xl flex-col gap-5 bg-card">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>Review the submission before sending feedback.</DialogDescription>
        </DialogHeader>

        <div className="flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-muted/10 p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${submission.studentName}`}
                alt={submission.studentName}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">{submission.studentName}</p>
              <p className="text-xs text-muted-foreground">
                {submission.course} • {submission.assignment}
              </p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">Submitted {submission.submittedAt}</div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Student Answer</p>
          <div className="rounded-lg border border-border/60 bg-muted/10 p-3 text-sm text-muted-foreground">
            {submission.answer}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Course Feedback</p>
          <div className="space-y-2 rounded-lg border border-border/60 bg-muted/10 p-3">
            {ratingStars ? (
              ratingStars
            ) : (
              <p className="text-xs text-muted-foreground">No rating yet</p>
            )}
            <p className="text-sm text-muted-foreground">
              {submission.instructorFeedback || "No feedback submitted yet."}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Personalized Feedback</p>
          <Textarea
            placeholder="Provide constructive feedback and suggestions..."
            value={personalizedFeedback}
            onChange={(event) => setPersonalizedFeedback(event.target.value)}
            className="min-h-[110px]"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" className="gap-2" onClick={handleSuggest}>
            <SparklesIcon className="size-4" />
            Suggest Resources
          </Button>
          <Button type="button" className="gap-2" onClick={handleSend}>
            <SendIcon className="size-4" />
            Send Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
