"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { LoginErrorResponse } from "@/types/auth";
import { RESET_PASSWORD_TOKEN_STORAGE_KEY } from "@/constants/auth";

import { useForgetPassword, useVerifyEmail } from "@/hooks";

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

const OTP_LENGTH = 6;

export default function ForgotPasswordForm() {
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => "")
  );
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();
  const { mutateAsync: forgetPassword, isPending: isForgetPending } = useForgetPassword();
  const { mutateAsync: verifyEmail, isPending: isVerifyPending } = useVerifyEmail();
  const isLoading = isForgetPending || isVerifyPending;
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

  function getErrorMessage(error: unknown, fallbackMessage: string) {
    if (!axios.isAxiosError<LoginErrorResponse>(error)) {
      return fallbackMessage;
    }

    return (
      error.response?.data?.errorMessages?.[0]?.message ??
      error.response?.data?.message ??
      error.message ??
      fallbackMessage
    );
  }

  async function onSubmit(data: ForgotPasswordFormData) {
    const toastId = toast.loading("Sending OTP...");

    try {
      const response = await forgetPassword({ email: data.email });
      setEmailForOtp(data.email);
      setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ""));
      setOtpError("");
      setIsOtpOpen(true);
      toast.success(response.message || "OTP sent successfully.", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to send OTP. Please try again."), {
        id: toastId
      });
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
    const targetEmail = emailForOtp || form.getValues("email");

    if (!targetEmail) {
      toast.error("Email is required to resend OTP.");
      return;
    }

    const toastId = toast.loading("Resending OTP...");

    try {
      const response = await forgetPassword({ email: targetEmail });
      toast.success(response.message || "OTP has been resent to your email.", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to resend OTP. Please try again."), {
        id: toastId
      });
    }
  }

  async function handleOtpSubmit() {
    if (!canSubmitOtp) {
      setOtpError("Please enter the 6-digit code.");
      return;
    }

    const targetEmail = emailForOtp || form.getValues("email");

    if (!targetEmail) {
      setOtpError("Email is required for verification.");
      return;
    }

    const oneTimeCode = Number.parseInt(otpDigits.join(""), 10);
    const toastId = toast.loading("Verifying OTP...");

    try {
      const response = await verifyEmail({
        email: targetEmail,
        oneTimeCode
      });

      if (!response.success || typeof response.data !== "string" || !response.data.trim()) {
        throw new Error("Invalid verification response from server.");
      }

      sessionStorage.setItem(RESET_PASSWORD_TOKEN_STORAGE_KEY, response.data.trim());
      toast.success(response.message || "OTP verified successfully.", { id: toastId });
      router.push("/new-password");
    } catch (error) {
      const message = getErrorMessage(error, "Invalid or expired OTP.");
      setOtpError(message);
      toast.error(message, { id: toastId });
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
          Enter your email for the verification process, we will send a 6 digit code to your email.
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
              Enter your 6 digit code that you received in your email.
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
