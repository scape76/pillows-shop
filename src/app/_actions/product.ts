"use server";

import { db } from "@/db";
import { Product, Store, products, stores } from "@/db/schema";
import { productSchema } from "@/lib/validations/product";
import { User } from "@clerk/nextjs/dist/types/server";
import { and, eq, inArray, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export async function addProductAction(
  input: z.infer<typeof productSchema> & {
    userId: User["id"];
    storeId: Store["id"];
  }
) {
  if (typeof input.storeId !== "number") {
    throw new Error("Invalid input");
  }

  const usersStore = await db.query.stores.findFirst({
    where: and(eq(stores.id, input.storeId), eq(stores.userId, input.userId)),
  });

  if (!usersStore) {
    throw new Error("Store not found or you are not the owner.");
  }

  await db.insert(products).values({
    name: input.name,
    description: input.description,
    storeId: input.storeId,
    price: input.price,
    category: input.category,
  });
}
export async function checkProductAction(input: {
  name: Product["name"];
  id?: Product["id"];
}) {
  if (typeof input.name !== "string") {
    throw new Error("Invalid input.");
  }

  const productWithSameName = await db.query.products.findFirst({
    where: input.id
      ? and(not(eq(products.id, input.id)), eq(products.name, input.name))
      : eq(products.name, input.name),
  });

  if (productWithSameName) {
    throw new Error("Product name already taken.");
  }
}

export async function deleteProductAction(input: {
  storeId: Store["id"];
  id: Product["id"];
}) {
  if (typeof input.storeId !== "number") {
    throw new Error("Invalid input");
  }

  if (typeof input.id !== "number") {
    throw new Error("Invalid input");
  }

  await db
    .delete(products)
    .where(and(eq(products.id, input.id), eq(products.storeId, input.storeId)));

  revalidatePath(`/dashboard/stores${input.storeId}/products`);
}

export async function deleteProductsAction(input: {
  storeId: Store["id"];
  ids: Product["id"][];
}) {
  if (typeof input.storeId !== "number") {
    throw new Error("Invalid input");
  }

  if (input.ids.some((id) => typeof id !== "number")) {
    throw new Error("Invalid input");
  }

  await db
    .delete(products)
    .where(
      and(
        input.ids.length > 0 ? inArray(products.id, input.ids) : undefined,
        eq(products.storeId, input.storeId)
      )
    );

  revalidatePath(`/dashboard/stores${input.storeId}/products`);
}
