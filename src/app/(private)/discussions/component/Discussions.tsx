"use client";

import { useEffect, useState } from "react";

import { Search, X } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";

import { useDeleteDiscussionPost } from "@/lib/api/discussions/delete-post";
import { useGetDiscussionCourseOptions } from "@/lib/api/discussions/get-course-options";
import { useGetDiscussionPosts } from "@/lib/api/discussions/get-posts";

import { useToast } from "@/hooks/use-toast";

import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { DiscussionPost, DiscussionQueryParams } from "@/types";

import DiscussionDetailDialog from "./DiscussionDetailDialog";
import {
  DiscussionFiltersSkeleton,
  DiscussionListSkeleton,
  DiscussionPaginationSkeleton
} from "./DiscussionsSkeleton";
import DiscussionThread from "./DiscussionThread";

const ALL_COURSES_VALUE = "all-courses";

interface DiscussionsProps {
  params: DiscussionQueryParams;
  onParamsChange: (params: DiscussionQueryParams) => void;
}

export default function Discussions({ params, onParamsChange }: DiscussionsProps) {
  const { toast } = useToast();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(params.searchTerm ?? "");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 500);
  const [deleteTarget, setDeleteTarget] = useState<DiscussionPost | null>(null);
  const { data, isPending, isFetching, isError } = useGetDiscussionPosts(params);
  const {
    data: courseOptionsResponse,
    isPending: isLoadingCourseOptions,
    isError: isCourseOptionsError
  } = useGetDiscussionCourseOptions();
  const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeleteDiscussionPost();
  const posts = data?.data ?? [];
  const pagination = data?.pagination;
  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPage ?? 1;
  const courseOptions = courseOptionsResponse?.data ?? [];
  const hasActiveFilters = Boolean((params.searchTerm ?? "").trim() || params.courseId);

  useEffect(() => {
    if ((params.searchTerm ?? "") === debouncedSearchTerm) {
      return;
    }

    onParamsChange({
      ...params,
      searchTerm: debouncedSearchTerm,
      page: 1
    });
  }, [debouncedSearchTerm, onParamsChange, params]);

  const handleCourseChange = (value: string) => {
    onParamsChange({
      ...params,
      courseId: value === ALL_COURSES_VALUE ? "" : value,
      page: 1
    });
  };

  const handlePageChange = (page: number) => {
    onParamsChange({
      ...params,
      page
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    onParamsChange({
      ...params,
      searchTerm: "",
      courseId: "",
      page: 1
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      const response = await deletePost({ postId: deleteTarget._id });
      toast({
        title: "Success",
        description: response.message || "Post deleted successfully.",
        variant: "default"
      });
      setDeleteTarget(null);

      if (selectedPostId === deleteTarget._id) {
        setSelectedPostId(null);
      }
    } catch {
      toast({
        title: "Something went wrong",
        description: "Unable to delete the post. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">Discussions</h1>
          <p className="text-sm text-muted-foreground">
            Search community posts, filter by course, reply as admin, and moderate replies.
          </p>
        </header>

        {isLoadingCourseOptions && !courseOptionsResponse ? (
          <DiscussionFiltersSkeleton />
        ) : (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search discussions by title or content..."
                  className="bg-white pl-9"
                  aria-label="Search discussions"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select
                  value={
                    params.courseId && params.courseId.trim() ? params.courseId : ALL_COURSES_VALUE
                  }
                  onValueChange={handleCourseChange}
                >
                  <SelectTrigger className="w-full bg-white sm:w-[220px]">
                    <SelectValue placeholder="All courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_COURSES_VALUE}>All courses</SelectItem>
                    {courseOptions.map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasActiveFilters ? (
                  <Button variant="outline" onClick={handleClearFilters} className="gap-2 bg-white">
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        )}

        {isPending && !data ? (
          <DiscussionListSkeleton />
        ) : (
          <Card className="shadow-sm">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-sm font-semibold text-foreground">
                Discussion Posts ({pagination?.total ?? posts.length})
              </CardTitle>
              {isFetching ? (
                <p className="text-xs text-muted-foreground">Updating results...</p>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-3">
              {isError || isCourseOptionsError ? (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-6 text-sm text-destructive">
                  Unable to load discussions right now. Please refresh and try again.
                </div>
              ) : null}

              {!isError && !isCourseOptionsError && posts.length === 0 ? (
                <div className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
                  No posts matched the current search or course filter.
                </div>
              ) : null}

              {!isError && !isCourseOptionsError
                ? posts.map((post) => (
                    <DiscussionThread
                      key={post._id}
                      post={post}
                      onOpen={setSelectedPostId}
                      onDelete={setDeleteTarget}
                      isDeleting={isDeletingPost && deleteTarget?._id === post._id}
                    />
                  ))
                : null}
            </CardContent>
          </Card>
        )}

        {isPending && !data ? (
          <DiscussionPaginationSkeleton />
        ) : pagination && totalPages > 1 ? (
          <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {posts.length} of {pagination.total} posts
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              iconOnly
            />
          </div>
        ) : null}
      </div>

      <DiscussionDetailDialog
        key={selectedPostId ?? "discussion-detail-dialog"}
        postId={selectedPostId}
        open={Boolean(selectedPostId)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPostId(null);
          }
        }}
        onDeleted={() => setSelectedPostId(null)}
      />

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-foreground">
              Delete post
            </DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `This will permanently remove \"${deleteTarget.title}\" and its replies.`
                : "This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeletingPost}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeletingPost}>
              {isDeletingPost ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
