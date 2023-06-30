"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { Store, stores } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { getStoreSchema, storeSchema } from "@/lib/validations/store";
import { User } from "@clerk/nextjs/dist/types/server";
import { and, asc, desc, eq, lt, lte } from "drizzle-orm";
import * as z from "zod";

export async function addStoreAction(
  input: z.infer<typeof storeSchema> & { userId: User["id"] }
) {
  const storeWithSameName = await db.query.stores.findFirst({
    where: eq(stores.name, input.name),
  });

  if (storeWithSameName) {
    throw new Error("Store name already taken");
  }

  console.log("--------inserting---------");

  await db.insert(stores).values({
    name: input.name,
    description: input.description,
    userId: input.userId,
    slug: slugify(input.name),
  });

  revalidatePath("/dashboard/stores");
}

export async function getPreviousStoreIdAction(
  input: z.infer<typeof getStoreSchema>
) {
  if (typeof input.id !== "number" || typeof input.userId !== "string") {
    throw new Error("Invalid input.");
  }

  const previousStore = await db.query.stores.findFirst({
    where: and(eq(stores.userId, input.userId), lt(stores.id, input.id)),
    orderBy: desc(stores.id),
  });

  if (!previousStore) {
    const lastStore = await db.query.stores.findFirst({
      where: eq(stores.userId, input.userId),
      orderBy: desc(stores.id),
    });

    if (!lastStore) {
      throw new Error("Store not found.");
    }

    return lastStore.id;
  }

  return previousStore.id;
}

export async function getNextStoreIdAction(
  input: z.infer<typeof getStoreSchema>
) {
  if (typeof input.id !== "number" || typeof input.userId !== "string") {
    throw new Error("Invalid input.");
  }

  const nextStore = await db.query.stores.findFirst({
    where: and(eq(stores.userId, input.userId), lte(stores.id, input.id)),
    orderBy: asc(stores.id),
  });

  if (!nextStore) {
    const firstStore = await db.query.stores.findFirst({
      where: eq(stores.userId, input.userId),
      orderBy: asc(stores.id),
    });

    if (!firstStore) {
      throw new Error("Store not found.");
    }

    return firstStore.id;
  }

  return nextStore.id;
}
