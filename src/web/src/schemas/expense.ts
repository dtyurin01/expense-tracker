import { z } from "zod";
import { zIsoDate, zMoney } from "./common";

export const EntryTypeSchema = z.enum(["Expense", "Income"]);
export type EntryType = z.infer<typeof EntryTypeSchema>;

export const CurrencySchema = z.enum(["eur", "usd", "gbp", "uah"]);
export type Currency = z.infer<typeof CurrencySchema>;

export const ExpenseSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  categoryName: z.string().min(1),
  amount: z.number(),
  note: z.string().nullable().optional(),
  occurredAt: zIsoDate,
  entryType: EntryTypeSchema,
  currency: CurrencySchema,
});

export const ExpenseCreateSchema = z.object({
  categoryId: z.string(),
  amount: zMoney,
  occurredAt: zIsoDate,
  note: z.string().trim().max(300, "Max 300 symbols").optional(),
  entryType: EntryTypeSchema.default("Expense"),
  currency: CurrencySchema.default("eur"), // TODO create in setting prefferable
});

export type ExpenseCreate = z.output<typeof ExpenseCreateSchema>;
export type ExpenseCreateInput = z.input<typeof ExpenseCreateSchema>;
