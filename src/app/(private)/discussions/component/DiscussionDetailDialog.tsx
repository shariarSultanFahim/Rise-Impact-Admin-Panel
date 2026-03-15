"use client";

import { useState } from "react";
import Image from "next/image";

import { Edit3, ImageIcon, MessageSquareText, Reply, Send, ThumbsUp, Trash2 } from "lucide-react";

import { useDeleteDiscussionPost } from "@/lib/api/discussions/delete-post";
import { useDeleteDiscussionReply } from "@/lib/api/discussions/delete-reply";
import { useEditDiscussionReply } from "@/lib/api/discussions/edit-reply";
import { useGetDiscussionPost } from "@/lib/api/discussions/get-post";
import { useReplyToDiscussionPost } from "@/lib/api/discussions/reply-post";
import { useGetUsersProfile } from "@/lib/api/profile/get-profile";
import { timeAgo } from "@/lib/date";

import { useToast } from "@/hooks/use-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import type { DiscussionPostDetail, DiscussionReply } from "@/types";

import { DiscussionDetailSkeleton } from "./DiscussionsSkeleton";

interface ReplyTarget {
  id: string;
  authorName: string;
}

interface DeleteTarget {
  kind: "post" | "reply";
  id: string;
  postId: string;
  label: string;
}

interface DiscussionDetailDialogProps {
  postId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

function isAdminRole(role: string) {
  return role === "SUPER_ADMIN";
}

function AdminBadge() {
  return (
    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
      Admin
    </Badge>
  );
}

export default function DiscussionDetailDialog({
  postId,
  open,
  onOpenChange,
  onDeleted
}: DiscussionDetailDialogProps) {
  const { toast } = useToast();
  const { data: currentUser } = useGetUsersProfile();
  const [replyContent, setReplyContent] = useState("");
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const { data, isPending, isError } = useGetDiscussionPost(postId, open);
  const { mutateAsync: replyToPost, isPending: isReplying } = useReplyToDiscussionPost();
  const { mutateAsync: editReply, isPending: isEditingReply } = useEditDiscussionReply();
  const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeleteDiscussionPost();
  const { mutateAsync: deleteReply, isPending: isDeletingReply } = useDeleteDiscussionReply();
  const post = data?.data;
  const isDeleting = isDeletingPost || isDeletingReply;

  const startEditingReply = (replyId: string, content: string) => {
    setEditingReplyId(replyId);
    setEditingReplyContent(content);
    setReplyTarget(null);
  };

  const cancelEditingReply = () => {
    setEditingReplyId(null);
    setEditingReplyContent("");
  };

  const handleSaveReplyEdit = async () => {
    const trimmedContent = editingReplyContent.trim();

    if (!postId || !editingReplyId || !trimmedContent) {
      return;
    }

    try {
      const response = await editReply({
        replyId: editingReplyId,
        postId,
        content: trimmedContent
      });

      toast({
        title: "Success",
        description: response.message || "Reply updated successfully.",
        variant: "default"
      });

      cancelEditingReply();
    } catch {
      toast({
        title: "Something went wrong",
        description: "Unable to update the reply. Please try again.",
        variant: "destructive"
      });
    }
  };

  const canEditReply = (authorId: string) => currentUser?._id === authorId;

  const handleSubmitReply = async () => {
    const trimmedContent = replyContent.trim();

    if (!postId || !trimmedContent) {
      return;
    }

    try {
      const response = await replyToPost({
        postId,
        content: trimmedContent,
        parentReplyId: replyTarget?.id
      });

      toast({
        title: "Success",
        description: response.message || "Reply posted successfully.",
        variant: "default"
      });

      setReplyContent("");
      setReplyTarget(null);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Unable to post the reply. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      if (deleteTarget.kind === "post") {
        const response = await deletePost({ postId: deleteTarget.id });
        toast({
          title: "Success",
          description: response.message || "Post deleted successfully.",
          variant: "default"
        });
        setDeleteTarget(null);
        onOpenChange(false);
        onDeleted?.();
        return;
      }

      const response = await deleteReply({
        replyId: deleteTarget.id,
        postId: deleteTarget.postId
      });

      toast({
        title: "Success",
        description: response.message || "Reply deleted successfully.",
        variant: "default"
      });
      setDeleteTarget(null);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Unable to delete the selected item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderReply = (reply: DiscussionReply) => {
    const isEditingReplyItem = editingReplyId === reply._id;
    const canEditCurrentReply = canEditReply(reply.author._id);

    return (
      <div key={reply._id} className="rounded-xl border bg-muted/20 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Avatar className="bg-muted" size="sm">
              <AvatarImage src={reply.author.profilePicture ?? undefined} alt={reply.author.name} />
              <AvatarFallback className="text-xs font-semibold">
                {getInitials(reply.author.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{reply.author.name}</p>
                {isAdminRole(reply.author.role) ? <AdminBadge /> : null}
                <span className="text-xs text-muted-foreground">{timeAgo(reply.createdAt)}</span>
              </div>

              {isEditingReplyItem ? (
                <div className="space-y-3">
                  <Textarea
                    value={editingReplyContent}
                    onChange={(event) => setEditingReplyContent(event.target.value)}
                    className="min-h-[110px] bg-white"
                    aria-label="Edit reply"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveReplyEdit}
                      disabled={isEditingReply || editingReplyContent.trim().length === 0}
                    >
                      {isEditingReply ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEditingReply}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-foreground/85">{reply.content}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canEditCurrentReply ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
                onClick={() => startEditingReply(reply._id, reply.content)}
                disabled={isEditingReply && !isEditingReplyItem}
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              disabled={isEditingReplyItem}
              onClick={() =>
                setReplyTarget({
                  id: reply._id,
                  authorName: reply.author.name
                })
              }
            >
              <Reply className="h-4 w-4" />
              Reply
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Delete reply"
              onClick={() =>
                setDeleteTarget({
                  kind: "reply",
                  id: reply._id,
                  postId: postId ?? "",
                  label: reply.author.name
                })
              }
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>

        {reply.children.length > 0 ? (
          <div className="mt-4 space-y-3 border-l border-border/70 pl-4">
            {reply.children.map((child) => (
              <div key={child._id} className="rounded-lg border bg-white/70 p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <Avatar className="bg-muted" size="sm">
                      <AvatarImage
                        src={child.author.profilePicture ?? undefined}
                        alt={child.author.name}
                      />
                      <AvatarFallback className="text-xs font-semibold">
                        {getInitials(child.author.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{child.author.name}</p>
                        {isAdminRole(child.author.role) ? <AdminBadge /> : null}
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(child.createdAt)}
                        </span>
                      </div>

                      {editingReplyId === child._id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editingReplyContent}
                            onChange={(event) => setEditingReplyContent(event.target.value)}
                            className="min-h-[110px] bg-white"
                            aria-label="Edit nested reply"
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={handleSaveReplyEdit}
                              disabled={isEditingReply || editingReplyContent.trim().length === 0}
                            >
                              {isEditingReply ? "Saving..." : "Save"}
                            </Button>
                            <Button variant="outline" size="sm" onClick={cancelEditingReply}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground/85">{child.content}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {canEditReply(child.author._id) ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => startEditingReply(child._id, child.content)}
                        disabled={isEditingReply && editingReplyId !== child._id}
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete nested reply"
                      onClick={() =>
                        setDeleteTarget({
                          kind: "reply",
                          id: child._id,
                          postId: postId ?? "",
                          label: child.author.name
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl bg-white sm:max-h-[85vh]">
          <DialogHeader className="pr-8">
            <DialogTitle className="text-base font-semibold text-foreground">
              {post?.title ?? "Discussion details"}
            </DialogTitle>
            <DialogDescription>
              Review the post, moderate replies, and respond as admin.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            {isPending ? <DiscussionDetailSkeleton /> : null}

            {isError || (!isPending && !post) ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-10 text-center text-sm text-destructive">
                Unable to load the selected post.
              </div>
            ) : null}

            {post ? (
              <>
                <PostSummary
                  post={post}
                  onDelete={() =>
                    setDeleteTarget({
                      kind: "post",
                      id: post._id,
                      postId: post._id,
                      label: post.title
                    })
                  }
                />

                <section className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold text-foreground">
                      Replies ({post.repliesCount})
                    </h2>
                    {post.hasMoreReplies ? (
                      <p className="text-xs text-muted-foreground">
                        This post has more than 200 replies in total.
                      </p>
                    ) : null}
                  </div>

                  {post.replies.length > 0 ? (
                    <div className="space-y-3">
                      {post.replies.map((reply) => renderReply(reply))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                      No replies yet. Post the first admin response below.
                    </div>
                  )}
                </section>

                <section className="space-y-3 rounded-xl border bg-primary/5 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Reply as admin</h3>
                      <p className="text-xs text-muted-foreground">
                        {replyTarget
                          ? `Replying to ${replyTarget.authorName}. Nested replies support one level only.`
                          : "Write a direct response to the original post."}
                      </p>
                    </div>
                    {replyTarget ? (
                      <Button variant="outline" size="sm" onClick={() => setReplyTarget(null)}>
                        Cancel nested reply
                      </Button>
                    ) : null}
                  </div>

                  <Textarea
                    value={replyContent}
                    onChange={(event) => setReplyContent(event.target.value)}
                    placeholder="Type your reply..."
                    className="min-h-[120px] bg-white"
                    aria-label="Reply to discussion post"
                  />

                  <div className="flex justify-start">
                    <Button
                      className="gap-2"
                      onClick={handleSubmitReply}
                      disabled={isReplying || replyContent.trim().length === 0}
                    >
                      <Send className="h-4 w-4" />
                      {isReplying ? "Sending..." : "Send Reply"}
                    </Button>
                  </div>
                </section>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(nextOpen) => !nextOpen && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-foreground">
              {deleteTarget?.kind === "post" ? "Delete post" : "Delete reply"}
            </DialogTitle>
            <DialogDescription>
              {deleteTarget?.kind === "post"
                ? `This will permanently remove \"${deleteTarget.label}\" and every reply attached to it.`
                : `This will permanently remove the reply from ${deleteTarget?.label}.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface PostSummaryProps {
  post: DiscussionPostDetail;
  onDelete: () => void;
}

function PostSummary({ post, onDelete }: PostSummaryProps) {
  return (
    <section className="rounded-xl border bg-muted/20 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar className="bg-muted" size="sm">
            <AvatarImage src={post.author.profilePicture ?? undefined} alt={post.author.name} />
            <AvatarFallback className="text-xs font-semibold">
              {getInitials(post.author.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
              <span className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>{post.course}</span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {post.likesCount} likes
              </span>
              <span className="flex items-center gap-1">
                <MessageSquareText className="h-3 w-3" />
                {post.repliesCount} replies
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-foreground/85">{post.content}</p>

              {post.image ? (
                <figure className="overflow-hidden rounded-xl border bg-white/70">
                  <div className="flex items-center gap-2 border-b px-3 py-2 text-sm text-foreground">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <figcaption>Attached image</figcaption>
                  </div>
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={1280}
                    height={720}
                    className="max-h-[420px] w-full bg-muted/30 object-contain"
                  />
                </figure>
              ) : null}
            </div>
          </div>
        </div>

        <Button variant="ghost" size="icon-sm" aria-label="Delete post" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </section>
  );
}
