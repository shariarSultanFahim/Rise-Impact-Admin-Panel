"use client";

import Image from "next/image";

import { MessageSquareText, ThumbsUp, Trash2 } from "lucide-react";

import { timeAgo } from "@/lib/date";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { DiscussionPost } from "@/types";

interface DiscussionThreadProps {
  post: DiscussionPost;
  onOpen: (postId: string) => void;
  onDelete: (post: DiscussionPost) => void;
  isDeleting?: boolean;
}

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export default function DiscussionThread({
  post,
  onOpen,
  onDelete,
  isDeleting = false
}: DiscussionThreadProps) {
  return (
    <div
      className="flex cursor-pointer flex-col gap-4 rounded-xl border bg-muted/20 px-4 py-4 transition hover:border-primary/30 hover:bg-primary/5 sm:flex-row sm:items-start sm:justify-between"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(post._id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(post._id);
        }
      }}
    >
      <div className="flex min-w-0 items-start gap-3">
        <Avatar className="bg-muted" size="sm">
          <AvatarImage src={post.author.profilePicture ?? undefined} alt={post.author.name} />
          <AvatarFallback className="text-xs font-semibold">
            {getInitials(post.author.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 space-y-2">
          <p className="text-sm font-semibold text-foreground">{post.title}</p>

          <p className="text-xs text-muted-foreground">
            Posted by {post.author.name} in {post.course}
          </p>

          <p className="line-clamp-2 text-sm text-foreground/80">{post.content}</p>

          {post.image ? (
            <figure className="overflow-hidden rounded-lg border bg-white/70">
              <Image
                src={post.image}
                alt={post.title}
                width={640}
                height={320}
                className="h-40 w-full object-cover"
              />
            </figure>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageSquareText className="h-3 w-3" />
              {post.repliesCount} replies
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {post.likesCount} likes
            </span>
            <span>{timeAgo(post.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Delete discussion post"
          disabled={isDeleting}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(post);
          }}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
