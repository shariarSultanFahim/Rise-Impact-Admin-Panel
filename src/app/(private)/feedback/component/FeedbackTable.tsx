"use client";

import { useMemo } from "react";

import { StarHalfIcon, StarIcon } from "lucide-react";

import type { FeedbackAdminItem } from "@/types/feedback";

import { timeAgo } from "@/lib/date";

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
  submissions: FeedbackAdminItem[];
  onSelect: (submission: FeedbackAdminItem) => void;
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

export default function FeedbackTable({ submissions, onSelect }: FeedbackTableProps) {
  const ratingMap = useMemo(() => {
    return new Map(
      submissions.map((submission) => {
        if (!submission.rating) {
          return [submission._id, null];
        }

        const fullStars = Math.floor(submission.rating);
        const hasHalf = submission.rating % 1 !== 0;
        const stars = Array.from({ length: MAX_RATING }).map((_, index) => {
          if (index < fullStars) {
            return (
              <StarIcon
                key={`${submission._id}-star-${index}`}
                className="size-3.5 fill-amber-400 text-amber-400"
              />
            );
          }

          if (index === fullStars && hasHalf) {
            return (
              <StarHalfIcon
                key={`${submission._id}-star-${index}`}
                className="size-3.5 fill-amber-400 text-amber-400"
              />
            );
          }

          return (
            <StarIcon
              key={`${submission._id}-star-${index}`}
              className="size-3.5 text-muted-foreground"
            />
          );
        });

        return [submission._id, stars];
      })
    );
  }, [submissions]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[28%]">Student</TableHead>
          <TableHead className="w-[22%]">Course</TableHead>
          <TableHead className="w-[16%]">Rating</TableHead>
          <TableHead className="w-[24%]">Review</TableHead>
          <TableHead className="w-[10%]">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission) => {
          const rating = ratingMap.get(submission._id);

          return (
            <TableRow
              key={submission._id}
              className="cursor-pointer"
              onClick={() => onSelect(submission)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={
                        submission.student.profilePicture ??
                        `https://api.dicebear.com/9.x/pixel-art/svg?seed=${submission.student.name}`
                      }
                      alt={submission.student.name}
                    />
                    <AvatarFallback>{getInitials(submission.student.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {submission.student.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{submission.student.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm font-medium text-foreground">{submission.course.title}</p>
                <p className="text-xs text-muted-foreground">{timeAgo(submission.createdAt)}</p>
              </TableCell>
              <TableCell>
                <div className="mb-1 text-xs text-muted-foreground">
                  {submission.rating.toFixed(1)} / 5
                </div>
                {rating ? <div className="flex items-center gap-1">{rating}</div> : null}
              </TableCell>
              <TableCell>
                <p className="line-clamp-2 text-sm text-muted-foreground">{submission.review}</p>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    submission.adminResponse
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {submission.adminResponse ? "Responded" : "Pending"}
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
