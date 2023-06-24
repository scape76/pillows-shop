"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { useSignUp } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { authSchema } from "@/lib/validations/auth";
import { Button } from "../ui/Button";
import { Icons } from "../Icons";
import { PasswordInput } from "@/components/PasswordInput";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";

type Inputs = z.infer<typeof authSchema>;

const SignInForm = ({}) => {
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();
  const [isPending, startTransition] = React.useTransition();

  // react-hook-form
  const form = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: Inputs) {
    if (!isLoaded) return;

    startTransition(async () => {
      try {
        await signUp.create({
          emailAddress: data.email,
          password: data.password,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        router.push("/signup/verify-email");
        toast({
          title: "Check your email",
          description: "We sent you a 6-digit verification code.",
        });
      } catch (e) {
        console.log(e);
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
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="ryangosling1980@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
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
          Continue
          <span className="sr-only">Continue to email verification page</span>
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
