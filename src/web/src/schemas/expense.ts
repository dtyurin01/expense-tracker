import { z } from "zod";
import { zIsoDate, zMoney } from "./common";

export const ExpenseSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  categoryName: z.string().min(1),
  amount: z.number(),
  note: z.string().nullable().optional(),
  occurredAt: zIsoDate,
});

export const ExpenseCreateSchema = z.object({
  categoryId: z.string(),
  amount: zMoney,
  occurredAt: zIsoDate,
  note: z.string().trim().max(300, "Max 300 symbols").optional(),
});

export type ExpenseCreate = z.output<typeof ExpenseCreateSchema>;
export type ExpenseCreateInput = z.input<typeof ExpenseCreateSchema>;
