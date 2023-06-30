import { stores, type Store } from "@/db/schema";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { db } from "@/db";
import { and, eq, not } from "drizzle-orm";
import { Button } from "@/components/ui/Button";
import { revalidatePath } from "next/cache";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { redirect } from "next/navigation";

interface pageProps {
  params: {
    id: string;
  };
}

const page: React.FC<pageProps> = async ({ params }) => {
  const storeId = Number(params.id);

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  });

  async function updateStore(fd: FormData) {
    "use server";

    const name = fd.get("name") as string;
    const description = fd.get("description") as string;

    const storeWithSameName = await db.query.stores.findFirst({
      where: and(eq(stores.name, name), not(eq(stores.id, storeId))),
      columns: {
        id: true,
      },
    });

    if (storeWithSameName)
      throw new Error("Store with the same name already exists.");

    await db
      .update(stores)
      .set({ name, description })
      .where(eq(stores.id, storeId));

    revalidatePath(`/dashboard/stores/${storeId}`);
  }

  async function deleteStore() {
    "use server";

    const store = await db.query.stores.findFirst({
      where: eq(stores.id, storeId),
    });

    if (!store) throw new Error("Store not found.");

    await db.delete(stores).where(eq(stores.id, storeId));

    redirect("/dashboard/stores");
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Manage your store</CardTitle>
        <CardDescription>You can update or delete your store</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={updateStore} className="grid w-full max-w-xl gap-5">
          <fieldset>
            <Label htmlFor="update-store-name">Name</Label>
            <Input
              id="update-store-name"
              name="name"
              defaultValue={store?.name}
            />
          </fieldset>
          <fieldset>
            <Label htmlFor="update-store-description">Description</Label>
            <Input
              id="update-store-description"
              name="description"
              defaultValue={store?.description ?? ""}
            />
          </fieldset>
          <LoadingButton type="submit">
            Update store
            <span className="sr-only">Update store</span>
          </LoadingButton>
          <LoadingButton formAction={deleteStore} variant={"destructive"}>
            Delete store
            <span className="sr-only">Delete store</span>
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
};

export default page;
