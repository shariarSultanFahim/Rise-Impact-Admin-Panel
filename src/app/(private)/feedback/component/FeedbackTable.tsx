"use client";

import { useMemo } from "react";

import { StarHalfIcon, StarIcon } from "lucide-react";

import type { FeedbackSubmission } from "@/types/feedback";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const MAX_RATING = 5;

type FeedbackTableProps = {
  submissions: FeedbackSubmission[];
  onSelect: (submission: FeedbackSubmission) => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getScoreClasses(score: number | null) {
  if (score === null) {
    return "bg-muted text-muted-foreground";
  }

  if (score >= 90) {
    return "bg-emerald-600 text-white";
  }

  if (score >= 80) {
    return "bg-amber-500 text-white";
  }

  return "bg-rose-500 text-white";
}

export default function FeedbackTable({ submissions, onSelect }: FeedbackTableProps) {
  const ratingMap = useMemo(() => {
    return new Map(
      submissions.map((submission) => {
        if (!submission.rating) {
          return [submission.id, null];
        }

        const fullStars = Math.floor(submission.rating);
        const hasHalf = submission.rating % 1 !== 0;
        const stars = Array.from({ length: MAX_RATING }).map((_, index) => {
          if (index < fullStars) {
            return (
              <StarIcon
                key={`${submission.id}-star-${index}`}
                className="size-3.5 fill-amber-400 text-amber-400"
              />
            );
          }

          if (index === fullStars && hasHalf) {
            return (
              <StarHalfIcon
                key={`${submission.id}-star-${index}`}
                className="size-3.5 fill-amber-400 text-amber-400"
              />
            );
          }

          return (
            <StarIcon
              key={`${submission.id}-star-${index}`}
              className="size-3.5 text-muted-foreground"
            />
          );
        });

        return [submission.id, stars];
      })
    );
  }, [submissions]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[45%]">Submission</TableHead>
          <TableHead className="w-[25%]">Course</TableHead>
          <TableHead className="w-[15%]">Score</TableHead>
          <TableHead className="w-[15%]">Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission) => {
          const scoreLabel = submission.score === null ? "Not Graded" : `${submission.score}%`;
          const rating = ratingMap.get(submission.id);

          return (
            <TableRow
              key={submission.id}
              className="cursor-pointer"
              onClick={() => onSelect(submission)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${submission.studentName}`}
                      alt={submission.studentName}
                    />
                    <AvatarFallback>{getInitials(submission.studentName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {submission.studentName}
                    </p>
                    <p className="text-xs text-muted-foreground">{submission.assignment}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-xs text-muted-foreground">Course</p>
                <p className="text-sm font-medium text-foreground">{submission.course}</p>
              </TableCell>
              <TableCell>
                <p className="text-xs text-muted-foreground">Score</p>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${getScoreClasses(
                    submission.score
                  )}`}
                >
                  {scoreLabel}
                </span>
              </TableCell>
              <TableCell>
                <p className="text-xs text-muted-foreground">Rating</p>
                {rating ? (
                  <div className="flex items-center gap-1">{rating}</div>
                ) : (
                  <span className="text-xs text-muted-foreground">No rating</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
