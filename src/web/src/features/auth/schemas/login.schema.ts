import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (val) =>
        /[A-Z]/.test(val) && // at least one uppercase
        /[a-z]/.test(val) && // at least one lowercase
        /[0-9]/.test(val) && // at least one number
        /[^A-Za-z0-9]/.test(val), // at least one symbol
      {
        message:
          "Password must contain uppercase, lowercase, number, and symbol",
      }
    ),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
