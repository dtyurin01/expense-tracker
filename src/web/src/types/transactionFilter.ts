export type TxFilter = "all" | "income" | "expense";


export const LABEL: Record<TxFilter, string> = {
  all: "All",
  income: "Income only",
  expense: "Expenses only",
};