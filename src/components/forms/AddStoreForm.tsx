"use client";
import { User } from "@clerk/nextjs/dist/types/server";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { useSignIn } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { authSchema } from "@/lib/validations/auth";
import { Button } from "../ui/Button";
import { Icons } from "../Icons";
import { PasswordInput } from "@/components/PasswordInput";
import type * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { storeSchema } from "@/lib/validations/store";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/useToast";
import { addStoreAction } from "@/app/_actions/store";

interface AddStoreFormProps {
  userId: User["id"];
}

type Inputs = z.infer<typeof storeSchema>;

const AddStoreForm: React.FC<AddStoreFormProps> = ({ userId }) => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        await addStoreAction({ ...data, userId });

        form.reset();
        
        toast({
          title: "Store added successfully",
        });
        router.push("/dashboard/stores");
        router.refresh();
      } catch (e) {
        e instanceof Error
          ? toast({
              title: "Error",
              description: e.message,
              variant: "destructive",
            })
          : toast({
              title: "Error",
              description: "Something went wrong, please try again.",
              variant: "destructive",
            });
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Add store</CardTitle>
        <CardDescription>Add a new store to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid w-full max-w-xl gap-5"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type store name here." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type store description here."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="w-fit">
              Add store
              <span className="sr-only">Add store</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddStoreForm;
