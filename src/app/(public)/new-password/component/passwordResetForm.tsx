"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { LoginErrorResponse } from "@/types/auth";
import { LOGIN_PATH, RESET_PASSWORD_TOKEN_STORAGE_KEY } from "@/constants/auth";

import { useResetPassword } from "@/hooks";

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
  const router = useRouter();
  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const form = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  });

  async function onSubmit(data: PasswordResetFormData) {
    const resetToken = sessionStorage.getItem(RESET_PASSWORD_TOKEN_STORAGE_KEY);

    if (!resetToken) {
      toast.error("Reset session expired. Please request OTP again.");
      router.replace("/forgot-password");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Updating password...");

    try {
      const response = await resetPassword({
        token: resetToken,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });

      sessionStorage.removeItem(RESET_PASSWORD_TOKEN_STORAGE_KEY);
      toast.success(response.message || "Password updated successfully!", { id: toastId });
      router.replace(LOGIN_PATH);
    } catch (error) {
      const message = axios.isAxiosError<LoginErrorResponse>(error)
        ? (error.response?.data?.errorMessages?.[0]?.message ??
          error.response?.data?.message ??
          error.message)
        : error instanceof Error
          ? error.message
          : "Unable to update password. Please try again.";

      toast.error(message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative h-20 w-20">
            <Image src="/logo.png" alt="Rise & Impact" fill className="object-contain" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-start text-3xl text-foreground">New Password</h1>
        <p className="my-4">
          Set the new password for your account so you can login and access all featuress.
        </p>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">Enter New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="8 digits at least, with letters and numbers"
                      type="password"
                      disabled={isLoading || isPending}
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
                  <FormLabel className="text-sm text-foreground">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm your new password"
                      type="password"
                      disabled={isLoading || isPending}
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
              disabled={isLoading || isPending}
              className="h-auto w-full bg-[#576045] py-2 font-semibold text-white hover:bg-[#4a5539]"
            >
              {isLoading || isPending ? "Updating password..." : "UPDATE"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
