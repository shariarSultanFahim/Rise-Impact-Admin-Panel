"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ForgotPasswordFormData, forgotPasswordSchema } from "../schema/forgotPassword.schema";

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();
  const canSubmitOtp = useMemo(
    () => otpDigits.every((digit) => digit.trim().length === 1),
    [otpDigits]
  );

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setIsLoading(true);
    try {
      // TODO: Implement forgot password API call
      void data;
      setIsOtpOpen(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOtpChange(value: string, index: number) {
    const sanitizedValue = value.replace(/\D/g, "").slice(0, 1);
    const nextOtp = [...otpDigits];
    nextOtp[index] = sanitizedValue;
    setOtpDigits(nextOtp);
    setOtpError("");

    if (sanitizedValue && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(event: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleOtpResend() {
    setIsLoading(true);
    try {
      //  TODO: Implement OTP resend API call
      toast.success("OTP has been resent to your email.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOtpSubmit() {
    if (!canSubmitOtp) {
      setOtpError("Please enter the 4-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement OTP verification API call
      router.push("/new-password");
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
        <h1 className="text-start text-3xl text-foreground">Forgot password</h1>
        <p className="my-4 text-sm">
          Enter your email for the verification proccess,we will send 4 digits code to your email.
        </p>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">E-mail</FormLabel>
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

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="h-auto w-full bg-[#576045] py-2 font-semibold text-white hover:bg-[#4a5539]"
            >
              {isLoading ? "Sending..." : "CONTINUE"}
            </Button>
          </form>
        </Form>

        {/* Forgot Password Link */}
        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-700">
            <Button variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>

      <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#1f2a44]">
              Verification
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Enter your 4 digits code that you received on your email.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-4">
              {otpDigits.map((digit, index) => (
                <input
                  key={`otp-${index}`}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleOtpChange(event.target.value, index)}
                  onKeyDown={(event) => handleOtpKeyDown(event, index)}
                  className="h-14 w-14 rounded-md border border-secondary text-center text-xl font-semibold text-foreground focus:border-[#d08c3d] focus:ring-2 focus:ring-[#d08c3d]/30 focus:outline-none"
                />
              ))}
            </div>

            <p className="text-sm font-semibold text-secondary">00:30</p>
            {otpError ? <p className="text-sm text-destructive">{otpError}</p> : null}

            <Button
              type="button"
              onClick={handleOtpSubmit}
              disabled={isLoading}
              className="h-auto w-full bg-[#576045] py-2 font-semibold text-white hover:bg-[#4a5539]"
            >
              {isLoading ? "Verifying..." : "CONTINUE"}
            </Button>

            <p className="text-sm text-muted-foreground">
              If you didn&apos;t receive a code!{" "}
              <button
                type="button"
                onClick={handleOtpResend}
                className="font-semibold text-primary hover:underline"
              >
                Resend
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
