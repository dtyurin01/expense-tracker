import { z } from "zod";
import { PASSWORD_REQUIREMENTS } from "./register.schema";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: PASSWORD_REQUIREMENTS.reduce(
      (schema, req) => schema.regex(req.regex, req.message),
      z.string()
    ),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
