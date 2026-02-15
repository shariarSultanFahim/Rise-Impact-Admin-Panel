"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

type NotificationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  audienceLabel?: string;
};

export default function NotificationModal({
  open,
  onOpenChange,
  title,
  message,
  audienceLabel
}: NotificationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-card">
        <DialogHeader className="py-5">
          <DialogTitle>Notification Preview</DialogTitle>
          <DialogDescription>See exactly what students will receive.</DialogDescription>
        </DialogHeader>
        <Card className="gap-4 border-dashed bg-white py-4">
          <CardHeader className="px-4">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{audienceLabel}</CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            <p className="text-sm text-muted-foreground">{message}</p>
          </CardContent>
        </Card>
        <DialogFooter className="py-5">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
