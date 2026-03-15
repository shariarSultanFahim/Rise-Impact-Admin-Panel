"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  iconOnly?: boolean;
  previousLabel?: string;
  nextLabel?: string;
}

function buildPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis-right", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis-left", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    "ellipsis-left",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-right",
    totalPages
  ];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  iconOnly = true,
  previousLabel = "Previous",
  nextLabel = "Next"
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const paginationItems = buildPaginationItems(currentPage, totalPages);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label={previousLabel}
      >
        {iconOnly ? <ChevronLeft className="h-4 w-4" /> : previousLabel}
      </Button>
      {paginationItems.map((item) => {
        if (typeof item !== "number") {
          return (
            <span
              key={item}
              className="flex h-8 min-w-8 items-center justify-center text-sm text-muted-foreground"
            >
              ...
            </span>
          );
        }

        const isActive = item === currentPage;

        return (
          <Button
            key={`page-${item}`}
            variant={isActive ? "default" : "outline"}
            size="sm"
            className={isActive ? "bg-primary text-primary-foreground" : ""}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        );
      })}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label={nextLabel}
      >
        {iconOnly ? <ChevronRight className="h-4 w-4" /> : nextLabel}
      </Button>
    </div>
  );
}
