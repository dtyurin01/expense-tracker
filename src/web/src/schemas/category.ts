import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
});
export type Category = z.infer<typeof CategorySchema>;


export const CategoryCreateSchema = z.object({
    name: z.string().min(2, "Minimum 2 characters").max(100, "Maximum 100 characters"),
});
export type CategoryCreate = z.infer<typeof CategoryCreateSchema>;