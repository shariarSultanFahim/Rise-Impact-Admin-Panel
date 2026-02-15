"use client";

import { useState } from "react";

import { MessageSquareText, Pin, Send, Trash2 } from "lucide-react";

import type { DiscussionMessage, DiscussionThreadItem } from "@/types/discussions";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface DiscussionThreadProps {
  thread: DiscussionThreadItem;
}

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export default function DiscussionThread({ thread }: DiscussionThreadProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleActionClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
  }

  function renderMessage(message: DiscussionMessage) {
    const isInstructor = message.role === "Instructor";

    return (
      <div key={message.id} className="flex gap-3 rounded-lg border bg-[#5760451A] px-3 py-3">
        <Avatar className="bg-muted" size="sm">
          <AvatarImage
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${message.author.split(" ")[0]}`}
            alt={message.author}
          />
          <AvatarFallback className="text-xs font-semibold">
            {getInitials(message.author)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{message.author}</p>
            {isInstructor ? (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Instructor
              </span>
            ) : null}
            <span className="text-xs text-muted-foreground">{message.time}</span>
          </div>
          <p className="text-sm text-foreground/80">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div
        className="flex cursor-pointer flex-col gap-3 rounded-lg border bg-muted/20 px-4 py-3 transition hover:border-muted sm:flex-row sm:items-center sm:justify-between"
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOpen();
          }
        }}
      >
        <div className="flex items-start gap-3">
          <Avatar className="bg-muted" size="sm">
            <AvatarImage
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${thread.author.split(" ")[0]}`}
              alt={thread.author}
            />
            <AvatarFallback className="text-xs font-semibold">
              {getInitials(thread.author)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{thread.title}</p>
            <p className="text-xs text-muted-foreground">
              Posted by {thread.author} in {thread.course}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageSquareText className="h-3 w-3" />
                {thread.replies} replies
              </span>
              <span>{thread.lastActive}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          {thread.isPinned ? (
            <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700">
              Pinned
            </span>
          ) : (
            <div className="flex items-center gap-2 text-rose-500">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Pin discussion"
                onClick={handleActionClick}
              >
                <Pin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Delete discussion"
                onClick={handleActionClick}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <DialogContent className="max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-foreground">
            {thread.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Posted by {thread.author} in {thread.course}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {thread.messages.map((message) => renderMessage(message))}
        </div>

        <div className="mt-5 space-y-2">
          <p className="text-sm font-semibold text-foreground">Reply as Instructor</p>
          <textarea
            className="min-h-[96px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            placeholder="Type your reply..."
          />
          <div className="flex justify-start">
            <Button className="gap-2 bg-[#576045] text-white hover:bg-[#4a5539]">
              <Send className="h-4 w-4" />
              Send Reply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
