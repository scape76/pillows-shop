'use server';

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { stores } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { storeSchema } from "@/lib/validations/store";
import { User } from "@clerk/nextjs/dist/types/server";
import { eq } from "drizzle-orm";
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

  console.log('--------inserting---------')

  await db.insert(stores).values({
    name: input.name,
    description: input.description,
    userId: input.userId,
    slug: slugify(input.name),
  });

  revalidatePath("/dashboard/stores");
}
