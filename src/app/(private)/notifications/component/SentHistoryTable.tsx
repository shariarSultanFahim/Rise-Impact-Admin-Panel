"use client";

import { timeAgo } from "@/lib/date";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type { NotificationPagination, SentNotificationItem } from "@/types";

interface SentHistoryTableProps {
  notifications: SentNotificationItem[];
  isLoading: boolean;
  pagination?: NotificationPagination;
  onPageChange: (page: number) => void;
}

export default function SentHistoryTable({
  notifications,
  isLoading,
  pagination,
  onPageChange
}: SentHistoryTableProps) {
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Sent Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-60" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card className="shadow-sm">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">No notifications sent yet</p>
        </div>
      </Card>
    );
  }

  const totalPages = pagination?.totalPage ?? 1;
  const currentPage = pagination?.page ?? 1;
  const maxVisiblePages = 5;
  const visibleCount = Math.min(totalPages, maxVisiblePages);
  const endPage = Math.min(
    totalPages,
    Math.max(visibleCount, currentPage + Math.floor(visibleCount / 2))
  );
  const startPage = Math.max(1, endPage - visibleCount + 1);
  const pageNumbers = Array.from({ length: visibleCount }, (_, index) => startPage + index);

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Sent Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification._id}>
                  <TableCell className="max-w-xs">
                    <p className="truncate font-medium text-foreground">{notification.title}</p>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {notification.text}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {notification.audience === "all" ? (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          All Students
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                          {notification.courseTitle}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {notification.recipientCount}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {timeAgo(notification.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
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
          {pageNumbers.map((page) => {
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
