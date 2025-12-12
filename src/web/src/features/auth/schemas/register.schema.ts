import { z } from "zod";

export const PASSWORD_REQUIREMENTS = [
  {
    regex: /.{8,}/,
    label: "8+ chars",
    message: "Password must be at least 8 characters",
  },
  {
    regex: /[0-9]/,
    label: "Number",
    message: "Password must contain at least one number",
  },
  {
    regex: /[a-z]/,
    label: "Lowercase",
    message: "Password must contain at least one lowercase letter",
  },
  {
    regex: /[A-Z]/,
    label: "Uppercase",
    message: "Password must contain at least one uppercase letter",
  },
  {
    regex: /[^A-Za-z0-9]/,
    label: "Symbol",
    message: "Password must contain at least one symbol",
  },
] as const;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: PASSWORD_REQUIREMENTS.reduce(
      (schema, req) => schema.regex(req.regex, req.message),
      z.string()
    ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
