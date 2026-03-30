"use client";

import { useState } from "react";

import { SendIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useGetNotificationCourseOptions } from "@/lib/api/notifications/get-course-options";
import { useGetSentNotifications } from "@/lib/api/notifications/get-sent-notifications";
import { useSendNotification } from "@/lib/api/notifications/send-notification";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { NotificationQueryParams, SendNotificationPayload } from "@/types";

import type { NotificationFormData } from "../schema/notification.schema";
import { notificationSchema } from "../schema/notification.schema";
import SentHistoryTable from "./SentHistoryTable";

const TEXT_LIMIT = 5000;

export default function NotificationsContent() {
  const [historyParams, setHistoryParams] = useState<NotificationQueryParams>({
    page: 1,
    limit: 10,
    sort: "-createdAt"
  });

  // Initialize form
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      text: "",
      audience: "all",
      courseId: ""
    }
  });

  // API calls
  const { mutate: sendNotification, isPending: isSending } = useSendNotification();

  const { data: courseOptionsResponse, isPending: isCoursePending } =
    useGetNotificationCourseOptions();

  const { data: historyResponse, isPending: isHistoryPending } =
    useGetSentNotifications(historyParams);

  // Extract data from responses
  const courseOptions = courseOptionsResponse?.data ?? [];
  const sentNotifications = historyResponse?.data ?? [];
  const pagination = historyResponse?.pagination;

  // Get form values
  const audienceValue = form.watch("audience");
  const textValue = form.watch("text");
  const textCount = textValue?.length ?? 0;

  // Handle form submission
  const onSubmit = async (values: NotificationFormData) => {
    const payload: SendNotificationPayload = {
      title: values.title,
      text: values.text,
      audience: values.audience as "all" | "course",
      ...(values.audience === "course" && { courseId: values.courseId })
    };

    sendNotification(payload, {
      onSuccess: (response) => {
        const recipientCount = response?.data?.recipientCount ?? 0;
        toast.success(
          `Notification sent to ${recipientCount} student${recipientCount !== 1 ? "s" : ""}`
        );
        form.reset();
        // Refresh history
        setHistoryParams((prev) => ({ ...prev, page: 1 }));
      },
      onError: (error: unknown) => {
        let errorMessage = "Failed to send notification. Try again.";
        if (
          error &&
          typeof error === "object" &&
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object" &&
          "message" in error.response.data &&
          typeof error.response.data.message === "string"
        ) {
          errorMessage = error.response.data.message;
        }
        toast.error(errorMessage);
      }
    });
  };

  // Handle history page change
  const handleHistoryPageChange = (page: number) => {
    setHistoryParams((prev) => ({ ...prev, page }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Send Notification</h1>
        <p className="text-sm text-muted-foreground">
          Communicate with your students via notifications
        </p>
      </div>

      {/* Form Section */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Compose Message Card */}
          <Card>
            <CardHeader>
              <CardTitle>Compose Message</CardTitle>
              <CardDescription>Write a concise update for your students.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Title</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="Enter a clear, concise title"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Text Field */}
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your message here..."
                        className="min-h-[160px] bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {textCount} / {TEXT_LIMIT} characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Target Audience Card */}
          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
              <CardDescription>Choose who should receive this notification.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audience</FormLabel>
                    <FormControl>
                      <RadioGroup value={field.value} onValueChange={field.onChange}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="audience-all" />
                          <label htmlFor="audience-all" className="flex cursor-pointer flex-col">
                            <span className="text-sm font-medium">All Students</span>
                            <span className="text-xs text-muted-foreground">
                              Send to all students in the platform
                            </span>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="course" id="audience-course" />
                          <label htmlFor="audience-course" className="flex cursor-pointer flex-col">
                            <span className="text-sm font-medium">Specific Course</span>
                            <span className="text-xs text-muted-foreground">
                              Send to students enrolled in a course
                            </span>
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Course Selection - conditional */}
              {audienceValue === "course" && (
                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course</FormLabel>
                      <FormControl>
                        {isCoursePending ? (
                          <Skeleton className="h-9 w-full" />
                        ) : (
                          <Select value={field.value || ""} onValueChange={field.onChange}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                              {courseOptions.map((course) => (
                                <SelectItem key={course._id} value={course._id}>
                                  {course.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </FormControl>
                      <FormDescription className="text-xs">
                        Select the course to notify.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button type="submit" className="w-full gap-2 sm:w-auto" disabled={isSending}>
            <SendIcon className="h-4 w-4" />
            {isSending ? "Sending..." : "Send Notification"}
          </Button>
        </form>
      </Form>

      {/* Sent History Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Sent History</h2>
          <p className="text-sm text-muted-foreground">
            View all notifications you have sent to students
          </p>
        </div>

        <SentHistoryTable
          notifications={sentNotifications}
          isLoading={isHistoryPending}
          pagination={pagination}
          onPageChange={handleHistoryPageChange}
        />
      </div>
    </div>
  );
}
