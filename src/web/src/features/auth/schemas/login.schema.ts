import { z } from "zod";
import { PASSWORD_REQUIREMENTS, buildPasswordSchema } from "@/schemas/password";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: buildPasswordSchema(PASSWORD_REQUIREMENTS),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
