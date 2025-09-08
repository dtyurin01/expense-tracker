import type { Category } from "@/schemas/category";

export const BASE_CATEGORIES: Readonly<Category[]> = [
  { id: "groceries", name: "Groceries" },
  { id: "transport", name: "Transport" },
  { id: "housing", name: "Housing" },
  { id: "entertainment", name: "Entertainment" },
] satisfies ReadonlyArray<Category>;

export type BaseCategoryId = (typeof BASE_CATEGORIES)[number]["id"];

export const DEFAULT_CATEGORY_ID: BaseCategoryId = "groceries";

export function getBaseCategories(): Category[] {
  return [...BASE_CATEGORIES];
}
