"use client";

import { Camera, Mail, MapPin, Phone, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UserProfileFormProps, UserProfileFormValues } from "@/types/user-profile";

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

import { userProfileSchema } from "../schema";

export function UserProfileForm({ initialValues }: UserProfileFormProps) {
  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      fullName: initialValues.fullName,
      email: initialValues.email,
      phone: initialValues.phone,
      address: initialValues.address
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    console.log("User profile", values);
    toast.success("Profile updated.");
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <Card className="rounded-3xl border-border shadow-sm">
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32 rounded-full">
                <AvatarImage src={initialValues.avatarUrl} />
                <AvatarFallback className="bg-muted text-5xl text-primary">
                  {initialValues.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" size="sm" className="gap-2 border-dashed">
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
                name="fullName"
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
                        <InputGroupInput placeholder="user@example.com" {...field} />
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
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
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="px-6">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
