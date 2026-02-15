"use client";

import { useState } from "react";

import { BookOpenIcon, EyeIcon, SendIcon, UserIcon, UsersIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import type { NotificationsData, NotificationTemplate } from "@/types/notifications";

import { cn } from "@/lib/utils";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { NotificationFormData, notificationSchema } from "../schema/notification.schema";
import NotificationModal from "./NotificationModal";

type NotificationsContentProps = {
  data: NotificationsData;
};

const audienceIcons = {
  "all-students": UsersIcon,
  "specific-course": BookOpenIcon,
  "individual-student": UserIcon
};

const MESSAGE_LIMIT = 500;

export default function NotificationsContent({ data }: NotificationsContentProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      message: "",
      audience: data.audiences[0]?.id ?? ""
    }
  });

  const titleValue = useWatch({
    control: form.control,
    name: "title"
  });
  const messageValue = useWatch({
    control: form.control,
    name: "message"
  });
  const audienceValue = useWatch({
    control: form.control,
    name: "audience"
  });

  const messageCount = messageValue?.length ?? 0;
  const selectedAudience = data.audiences.find((audience) => audience.id === audienceValue);
  const previewTitle = titleValue?.trim() || "Your Title Here";
  const previewMessage = messageValue?.trim() || "Your message will appear here...";
  const previewAudience = selectedAudience?.title ?? "Select an audience";

  const handleTemplateClick = (template: NotificationTemplate) => {
    setSelectedTemplateId(template.id);
    form.setValue("message", template.message, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const onSubmit = async (values: NotificationFormData) => {
    try {
      // TODO: Replace with API call once notifications endpoint is ready.
      await Promise.resolve(values);
      console.log("Notification data:", values);
      toast.success("Notification is ready to send.");
    } catch {
      toast.error("Unable to send notification. Try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{data.heading.title}</h1>
        <p className="text-muted-foreground">{data.heading.subtitle}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compose Message</CardTitle>
                  <CardDescription>Write a concise update for your students.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter a clear, concise title"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your message here..."
                            className="min-h-[160px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          {messageCount} / {MESSAGE_LIMIT} characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Target Audience</CardTitle>
                  <CardDescription>Choose who should receive this notification.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="audience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Audience</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select audience" />
                            </SelectTrigger>
                            <SelectContent>
                              {data.audiences.map((audience) => {
                                const Icon =
                                  audienceIcons[audience.id as keyof typeof audienceIcons] ??
                                  UsersIcon;

                                return (
                                  <SelectItem key={audience.id} value={audience.id}>
                                    <span className="flex items-center gap-2">
                                      <Icon className="size-4 text-muted-foreground" />
                                      <span className="flex flex-col text-left">
                                        <span className="text-sm font-medium">
                                          {audience.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {audience.description}
                                        </span>
                                      </span>
                                    </span>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <EyeIcon className="size-4" />
                  Preview
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={form.formState.isSubmitting}
                >
                  <SendIcon className="size-4" />
                  Send Notification
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Templates</CardTitle>
                  <CardDescription>Pick a ready-made message to start quickly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.templates.map((template) => (
                    <Button
                      key={template.id}
                      type="button"
                      variant="default"
                      className={cn(
                        "h-auto w-full justify-start gap-3 rounded-lg bg-white px-3 py-3 text-left text-black hover:text-white",
                        selectedTemplateId === template.id &&
                          "border-primary bg-primary/5 text-primary"
                      )}
                      onClick={() => handleTemplateClick(template)}
                    >
                      <span className="flex flex-col gap-1">
                        <span className="text-sm font-semibold">{template.title}</span>
                        <span className="text-xs">{template.description}</span>
                      </span>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>See how students will read the update.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Card className="gap-4 border-dashed bg-white py-4">
                    <CardHeader className="px-4">
                      <CardTitle className="text-base">{previewTitle}</CardTitle>
                      <CardDescription>{previewAudience}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-4">
                      <p className="text-sm text-muted-foreground">{previewMessage}</p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
      <NotificationModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        title={previewTitle}
        message={previewMessage}
        audienceLabel={previewAudience}
      />
    </div>
  );
}
