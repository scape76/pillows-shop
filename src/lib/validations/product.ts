import * as z from "zod";
import { products } from "@/db/schema";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "message must be at least 3 characters long" })
    .max(50, {
      message: "message cannot be more than 50 characters long",
    }),
  description: z
    .string()
    .min(3, { message: "description must be at least 3 characters long" })
    .max(255, {
      message: "description cannot be more than 255 characters long",
    })
    .optional(),
  category: z
    .enum(products.category.enumValues, {
      required_error: "Must be a valid category",
    })
    .default(products.category.enumValues[0]),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Must be a valid price",
  }),
});
