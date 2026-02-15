"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { termsSchema, type TermsFormData } from "../schema/terms.schema";

export default function TermsForm() {
  const form = useForm<TermsFormData>({
    resolver: zodResolver(termsSchema),
    defaultValues: {
      title: "",
      details: ""
    }
  });

  const onSubmit = async (values: TermsFormData) => {
    try {
      // TODO: Replace with API call for saving terms.
      await Promise.resolve(values);
      toast.success("Terms updated successfully.");
    } catch {
      toast.error("Unable to save terms. Try again.");
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Rise & impact terms & codition</h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 bg-card">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type here..." {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type here..."
                      className="min-h-[220px] bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="min-w-[160px]">
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
