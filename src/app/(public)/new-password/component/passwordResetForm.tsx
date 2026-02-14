"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordResetFormData, passwordResetSchema } from "../schema/reset.password.schema";

export default function PasswordResetForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  });

  async function onSubmit(data: PasswordResetFormData) {
    setIsLoading(true);
    try {
      // TODO: Implement password reset API call
      console.log("Password reset attempt:", data);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center px-4 w-full h-screen">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative h-20 w-20">
            <Image
              src="/logo.png"
              alt="Rise & Impact"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Heading */}
        <h1 className=" text-start text-3xl text-foreground">
          New Password
        </h1>
        <p className="my-4">Set the new password for your account so you can login and access all featuress.</p>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">
                    Enter New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="8 digits at least, with letters and numbers"
                      type="password"
                      disabled={isLoading}
                      className="bg-gray-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm your new password"
                      type="password"
                      disabled={isLoading}
                      className="bg-gray-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#576045] hover:bg-[#4a5539] text-white font-semibold py-2 h-auto"
            >
              {isLoading ? "Updating password..." : "UPDATE"}
            </Button>
          </form>
        </Form>

      </div>
    </div>
  );
}