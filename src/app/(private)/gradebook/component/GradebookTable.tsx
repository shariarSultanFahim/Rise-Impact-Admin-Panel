"use client";

import { timeAgo } from "@/lib/date";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type { GradebookItem, GradebookPagination } from "@/types";

interface GradebookTableProps {
  students: GradebookItem[];
  isLoading: boolean;
  pagination?: GradebookPagination;
  onPageChange: (page: number) => void;
}

function getInitials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

function scoreClass(score: number): string {
  if (score >= 90) return "text-emerald-600 font-semibold";
  if (score >= 80) return "text-orange-500 font-semibold";
  if (score >= 70) return "text-blue-600 font-medium";
  return "text-muted-foreground";
}

function completionBarColor(completion: number): string {
  if (completion >= 75) return "accent-emerald-600";
  if (completion >= 50) return "accent-orange-500";
  return "accent-red-600";
}

export default function GradebookTable({
  students,
  isLoading,
  pagination,
  onPageChange
}: GradebookTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Quizzes</TableHead>
              <TableHead>Avg %</TableHead>
              <TableHead>Assignments</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Enrolled Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell>
                  <Skeleton className="h-8 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t pt-4">
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">No student gradebook data found</p>
      </div>
    );
  }

  const totalPages = pagination?.totalPage ?? 1;
  const currentPage = pagination?.page ?? 1;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Quizzes</TableHead>
            <TableHead>Avg %</TableHead>
            <TableHead>Assignments</TableHead>
            <TableHead>Completion</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead>Enrolled Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="bg-muted" size="sm">
                    <AvatarImage
                      src={student.studentAvatar ?? undefined}
                      alt={student.studentName}
                    />
                    <AvatarFallback className="text-xs font-semibold">
                      {getInitials(student.studentName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{student.studentName}</p>
                    <p className="text-xs text-muted-foreground">{student.studentEmail}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                {student.courseTitle}
              </TableCell>
              <TableCell className="text-sm">
                {student.quizzesAttempted}/{student.totalQuizzes}
              </TableCell>
              <TableCell className={`text-sm ${scoreClass(student.overallQuizPercentage)}`}>
                {student.overallQuizPercentage.toFixed(2)}%
              </TableCell>
              <TableCell className="text-sm">
                {student.assignmentsSubmitted}/{student.totalAssignments}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <progress
                    value={student.completionPercentage}
                    max={100}
                    className={`h-2 w-28 ${completionBarColor(student.completionPercentage)}`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {student.completionPercentage}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {student.lastActivityDate ? timeAgo(student.lastActivityDate) : "Never"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {student.enrolledAt ? timeAgo(student.enrolledAt) : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t pt-4">
        <span className="text-sm text-muted-foreground">
          Showing page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
            let page = currentPage - 2 + index;
            if (page < 1) page = index + 1;
            if (page > totalPages) return null;

            const isActive = page === currentPage;
            return (
              <Button
                key={`page-${page}`}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
