import { z, type ZodString } from "zod";

export type PasswordRequirement = Readonly<{
  regex: RegExp;
  label: string;
  message: string;
}>;

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
] as const satisfies readonly PasswordRequirement[];

export function buildPasswordSchema(
  requirements: readonly PasswordRequirement[] = PASSWORD_REQUIREMENTS
): ZodString {
  return requirements.reduce(
    (schema, req) => schema.regex(req.regex, req.message),
    z.string()
  );
}

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: buildPasswordSchema(PASSWORD_REQUIREMENTS),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((v) => v.newPassword === v.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
