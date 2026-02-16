"use client";

import { useEffect, useState } from "react";

import { BookOpenIcon, EyeIcon, SendIcon, UserIcon, UsersIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import type { CourseCardItem } from "@/types/courses";
import type { NotificationsData } from "@/types/notifications";
import type { UserManagementUser } from "@/types/user-management";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";

import { NotificationFormData, notificationSchema } from "../schema/notification.schema";
import NotificationModal from "./NotificationModal";

type NotificationsContentProps = {
  data: NotificationsData;
  courses: CourseCardItem[];
  students: UserManagementUser[];
};

const audienceIcons = {
  "all-students": UsersIcon,
  "specific-course": BookOpenIcon,
  "individual-student": UserIcon
};

const MESSAGE_LIMIT = 500;

export default function NotificationsContent({
  data,
  courses,
  students
}: NotificationsContentProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      message: "",
      audience: data.audiences[0]?.id ?? "",
      courseId: "",
      studentId: ""
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
  const courseIdValue = useWatch({
    control: form.control,
    name: "courseId"
  });
  const studentIdValue = useWatch({
    control: form.control,
    name: "studentId"
  });

  const messageCount = messageValue?.length ?? 0;
  const selectedAudience = data.audiences.find((audience) => audience.id === audienceValue);
  const selectedCourse = courses.find((course) => course.id === courseIdValue);
  const selectedStudent = students.find((student) => student.id === studentIdValue);
  const previewTitle = titleValue?.trim() || "Your Title Here";
  const previewMessage = messageValue?.trim() || "Your message will appear here...";
  const previewAudience = selectedAudience?.title ?? "Select an audience";
  const previewAudienceDetail =
    audienceValue === "specific-course" && selectedCourse
      ? `Specific Course: ${selectedCourse.title}`
      : audienceValue === "individual-student" && selectedStudent
        ? `Individual Student: ${selectedStudent.name}`
        : previewAudience;

  const courseSearchValue = courseSearch.trim().toLowerCase();
  const studentSearchValue = studentSearch.trim().toLowerCase();
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(courseSearchValue)
  );
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(studentSearchValue)
  );

  useEffect(() => {
    if (audienceValue !== "specific-course" && form.getValues("courseId")) {
      form.setValue("courseId", "", { shouldValidate: true });
    }

    if (audienceValue !== "individual-student" && form.getValues("studentId")) {
      form.setValue("studentId", "", { shouldValidate: true });
    }
  }, [audienceValue, form]);

  const onSubmit = async (values: NotificationFormData) => {
    try {
      // TODO: Replace with API call once notifications endpoint is ready.
      await Promise.resolve(values);
      toast.success("Notification is ready to send.");
      form.reset();
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
          <div className="">
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

                  <FormField
                    control={form.control}
                    name="message"
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
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="audience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Audience</FormLabel>
                        <div className="space-y-3">
                          {data.audiences.map((audience) => {
                            const Icon =
                              audienceIcons[audience.id as keyof typeof audienceIcons] ?? UsersIcon;
                            const isSelected = field.value === audience.id;

                            return (
                              <label
                                key={audience.id}
                                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-white p-4 transition-colors hover:border-primary/50"
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => field.onChange(audience.id)}
                                />
                                <div className="flex flex-1 items-start gap-3">
                                  <Icon className="mt-0.5 size-4 text-muted-foreground" />
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium">{audience.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {audience.description}
                                    </p>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {audienceValue === "specific-course" ? (
                    <FormField
                      control={form.control}
                      name="courseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Search courses"
                              value={courseSearch}
                              onChange={(event) => setCourseSearch(event.target.value)}
                              className="bg-white"
                            />
                          </FormControl>
                          <div className="mt-3 max-h-56 overflow-y-auto rounded-lg border border-border bg-white">
                            {filteredCourses.length === 0 ? (
                              <p className="px-4 py-3 text-sm text-muted-foreground">
                                No courses found.
                              </p>
                            ) : (
                              filteredCourses.map((course) => (
                                <button
                                  key={course.id}
                                  type="button"
                                  onClick={() => {
                                    field.onChange(course.id);
                                    setCourseSearch("");
                                  }}
                                  className={`flex w-full items-start justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-muted/60 ${
                                    field.value === course.id
                                      ? "bg-muted/70 font-medium"
                                      : "text-foreground"
                                  }`}
                                >
                                  <span>{course.title}</span>
                                  {field.value === course.id ? (
                                    <span className="text-xs text-muted-foreground">Selected</span>
                                  ) : null}
                                </button>
                              ))
                            )}
                          </div>
                          <FormDescription className="text-xs">
                            Select the course to notify.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : null}

                  {audienceValue === "individual-student" ? (
                    <FormField
                      control={form.control}
                      name="studentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Search students"
                              value={studentSearch}
                              onChange={(event) => setStudentSearch(event.target.value)}
                              className="bg-white"
                            />
                          </FormControl>
                          <div className="mt-3 max-h-56 overflow-y-auto rounded-lg border border-border bg-white">
                            {filteredStudents.length === 0 ? (
                              <p className="px-4 py-3 text-sm text-muted-foreground">
                                No students found.
                              </p>
                            ) : (
                              filteredStudents.map((student) => (
                                <button
                                  key={student.id}
                                  type="button"
                                  onClick={() => {
                                    field.onChange(student.id);
                                    setStudentSearch("");
                                  }}
                                  className={`flex w-full items-start justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-muted/60 ${
                                    field.value === student.id
                                      ? "bg-muted/70 font-medium"
                                      : "text-foreground"
                                  }`}
                                >
                                  <span>{student.name}</span>
                                  {field.value === student.id ? (
                                    <span className="text-xs text-muted-foreground">Selected</span>
                                  ) : null}
                                </button>
                              ))
                            )}
                          </div>
                          <FormDescription className="text-xs">
                            Select the student to notify.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : null}
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
          </div>
        </form>
      </Form>
      <NotificationModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        title={previewTitle}
        message={previewMessage}
        audienceLabel={previewAudienceDetail}
      />
    </div>
  );
}
