"use client";

import { useMemo } from "react";

import { Camera, Mail, MapPin, Phone, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import type { UserProfileFormProps, UserProfileFormValues } from "@/types/user-profile";

import { useUpdateUsersProfile } from "@/lib/api/profile/update-profile";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { userProfileSchema } from "../schema";

export function UserProfileForm({ initialValues }: UserProfileFormProps) {
  const updateUsersProfileMutation = useUpdateUsersProfile();

  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: initialValues.name,
      email: initialValues.email,
      role: initialValues.role,
      status: initialValues.status,
      verified: initialValues.verified,
      phone: initialValues.phone,
      location: initialValues.location,
      dateOfBirth: initialValues.dateOfBirth,
      gender: initialValues.gender,
      profilePicture: initialValues.profilePicture,
      avatarFile: undefined
    }
  });

  const avatarFile = useWatch({
    control: form.control,
    name: "avatarFile"
  });

  const avatarPreview = useMemo(() => {
    if (avatarFile instanceof File) {
      return URL.createObjectURL(avatarFile);
    }

    return form.getValues("profilePicture");
  }, [avatarFile, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await updateUsersProfileMutation.mutateAsync({
        name: values.name,
        phone: values.phone,
        location: values.location,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        profilePicture: values.avatarFile
      });

      form.setValue("profilePicture", response.data.profilePicture ?? values.profilePicture);
      form.setValue("avatarFile", undefined);

      toast.success(response.message || "Profile updated successfully.");
    } catch {
      toast.error("Unable to update profile. Try again.");
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <Card className="rounded-3xl border-border shadow-sm">
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32 rounded-full">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback className="bg-muted text-5xl text-primary">
                  {initialValues.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) {
                    return;
                  }

                  form.setValue("avatarFile", file, { shouldValidate: true });
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 border-dashed"
                onClick={() => document.getElementById("profile-picture-upload")?.click()}
              >
                <Camera className="size-4" />
                Change Photo
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-navy text-base font-semibold">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <InputGroup className="bg-white">
                        <InputGroupAddon>
                          <User className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput placeholder="User Name" {...field} />
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <InputGroup className="bg-white">
                        <InputGroupAddon>
                          <Mail className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput placeholder="user@example.com" disabled {...field} />
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <InputGroup className="bg-white">
                          <InputGroupAddon>
                            <User className="size-4" />
                          </InputGroupAddon>
                          <InputGroupInput disabled {...field} />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <InputGroup className="bg-white">
                          <InputGroupAddon>
                            <User className="size-4" />
                          </InputGroupAddon>
                          <InputGroupInput disabled {...field} />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="verified"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verified</FormLabel>
                    <FormControl>
                      <InputGroup className="bg-white">
                        <InputGroupAddon>
                          <User className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput disabled value={field.value ? "Yes" : "No"} />
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <InputGroup className="bg-white">
                        <InputGroupAddon>
                          <Phone className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput placeholder="+45 12 34 56 78" {...field} />
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <InputGroup className="bg-white">
                        <InputGroupAddon>
                          <MapPin className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput placeholder="Street address, city" {...field} />
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Of Birth</FormLabel>
                      <FormControl>
                        <InputGroup className="bg-white">
                          <InputGroupInput type="date" {...field} />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="px-6" disabled={updateUsersProfileMutation.isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
