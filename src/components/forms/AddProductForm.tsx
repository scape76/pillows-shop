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
  UncontrolledFormMessage,
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
import { Textarea } from "@/components/ui/Textarea";
import { toast } from "@/components/ui/useToast";
import { addStoreAction } from "@/app/_actions/store";
import { Store, products } from "@/db/schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { productSchema } from "@/lib/validations/product";
import { addProductAction } from "@/app/_actions/product";

interface AddStoreFormProps {
  userId: User["id"];
  storeId: Store["id"];
  storeName: Store["name"];
}

type Inputs = z.infer<typeof productSchema>;

const AddStoreForm: React.FC<AddStoreFormProps> = ({
  userId,
  storeId,
  storeName,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<Inputs>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: "pillows",
    },
  });

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        await addProductAction({ ...data, storeId, userId });

        form.reset();

        toast({
          title: "Product added successfully",
        });
        router.push(`/dashboard/stores/${storeId}/products`);
        router.refresh();
      } catch (e) {
        console.log(e);
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
        <CardTitle className="text-2xl">Add product</CardTitle>
        <CardDescription>Add a new product to your {storeName}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid w-full max-w-xl gap-5"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  aria-invalid={!!form.formState.errors.name}
                  placeholder="Type product name here."
                  {...form.register("name")}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.name?.message}
              />
            </FormItem>
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  aria-invalid={!!form.formState.errors.description}
                  placeholder="Type product description here."
                  {...form.register("description")}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.description?.message}
              />
            </FormItem>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: typeof field.value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(products.category.enumValues).map(
                            (option) => (
                              <SelectItem
                                key={option}
                                value={option}
                                className="capitalize"
                              >
                                {option}
                              </SelectItem>
                            )
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  // pattern="[0-9]+"
                  {...form.register("price")}
                />
              </FormControl>
            </FormItem>
            <Button className="w-fit" disabled={isPending}>
              {isPending && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Add product
              <span className="sr-only">Add product</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddStoreForm;
