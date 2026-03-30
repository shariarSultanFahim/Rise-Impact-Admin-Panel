"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { LoginErrorResponse } from "@/types/auth";
import { AUTH_SESSION_COOKIE, DEFAULT_AUTHENTICATED_PATH } from "@/constants/auth";

import { cookie } from "@/lib/cookie-client";

import { buildSessionFromLoginResponse, useLogin } from "@/hooks";

import { Checkbox } from "@/components/ui";
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

import { loginSchema, type LoginFormData } from "../schema/login.schema";

export default function LoginForm() {
  const router = useRouter();
  const { mutateAsync: login, isPending } = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(data: LoginFormData) {
    const loadingToastId = toast.loading("Logging in...");

    try {
      const response = await login(data);
      const session = buildSessionFromLoginResponse(response);

      cookie.set(AUTH_SESSION_COOKIE, JSON.stringify(session));

      toast.success("Login successful!", { id: loadingToastId });
      router.replace(DEFAULT_AUTHENTICATED_PATH);
    } catch (error) {
      const message = axios.isAxiosError<LoginErrorResponse>(error)
        ? (error.response?.data?.errorMessages?.[0]?.message ??
          error.response?.data?.message ??
          error.message)
        : error instanceof Error
          ? error.message
          : "Login failed. Please check your credentials and try again.";

      toast.error(message, { id: loadingToastId });
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
        <h1 className="mb-8 text-start text-3xl text-foreground">Welcome Back</h1>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="hannah.green@test.com"
                      type="text"
                      disabled={isPending}
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password123@"
                      type="password"
                      disabled={isPending}
                      className="bg-gray-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="cursor-pointer text-sm text-foreground">
                Remember me on this computer
              </label>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="h-auto w-full bg-[#576045] py-2 font-semibold text-white hover:bg-[#4a5539]"
            >
              {isPending ? "Logging in..." : "LOG IN"}
            </Button>
          </form>
        </Form>

        {/* Forgot Password Link */}
        <div className="mt-6 text-center">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
