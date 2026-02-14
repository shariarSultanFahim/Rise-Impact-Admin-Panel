"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      // TODO: Implement login API call
      console.log("Login attempt:", data);
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
        <h1 className="mb-8 text-start text-3xl text-foreground">
          Welcome Back
        </h1>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">
                    User Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="hannah.green@test.com"
                      type="text"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password123@"
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

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm  text-foreground cursor-pointer"
              >
                Remember me on this computer
              </label>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#576045] hover:bg-[#4a5539] text-white font-semibold py-2 h-auto"
            >
              {isLoading ? "Logging in..." : "LOG IN"}
            </Button>
          </form>
        </Form>

        {/* Forgot Password Link */}
        <div className="mt-6 text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}