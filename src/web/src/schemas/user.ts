import { z } from "zod";

export const nicknameSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, "Nickname must be at least 2 characters")
    .max(32, "Nickname must be at most 32 characters"),
});

export type NicknameValues = z.infer<typeof nicknameSchema>;

export const emailChangeStartSchema = z.object({
  newEmail: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  currentPassword: z.string().min(1, "Current password is required"),
});

export type EmailChangeStartValues = z.infer<typeof emailChangeStartSchema>;
