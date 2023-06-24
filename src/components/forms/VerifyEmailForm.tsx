"use client";

import { verifyEmailSchema } from "@/lib/validations/auth";
import { isClerkAPIResponseError, useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/Icons";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";

type Inputs = z.infer<typeof verifyEmailSchema>;

const VerifyEmailForm = ({}) => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(data: Inputs) {
    if (!isLoaded) return;

    startTransition(async () => {
      try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: data.code,
        });

        if (completeSignUp.status !== "complete") {
          console.log(JSON.stringify(completeSignUp, null, 2));
        }

        if (completeSignUp.status === "complete") {
          await setActive({ session: completeSignUp.createdSessionId });
          router.push(`${window.location.origin}/`);
        }
      } catch (e) {
        const unknownError = "Something went wrong, please try again.";

        isClerkAPIResponseError(e)
          ? toast({
              title: "Something went wrong",
              description: e.errors[0]?.longMessage ?? unknownError,
            })
          : toast({ title: unknownError });
      }
    });
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="169420"
                  {...field}
                  onChange={(e) => {
                    e.target.value = e.target.value.trim();
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>
          {isPending && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Create account
          <span className="sr-only">Create account</span>
        </Button>
      </form>
    </Form>
  );
};

export default VerifyEmailForm;
