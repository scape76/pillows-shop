import * as z from "zod";

export const authSchema = z.object({
  email: z.string().email({
    message: "Please, enter a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 symbols long",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, {
      message:
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number",
    }),
});

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Verification code must be 6 characters long",
    })
    .max(6),
});
