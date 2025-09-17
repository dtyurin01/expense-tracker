import { CurrencyCode } from "@/lib/currencies";
import type { Period } from "@/schemas/period";

// ===== Response types =====
export type BalancePoint = { month: string; value: number }; // YYYY-MM
export type IEPoint = { month: string; income: number; expense: number }; // YYYY-MM
export type Slice = {
  id: string;
  label: string;
  value: number;
  color?: string;
};
export type TxRow = {
  id: string;
  cardMasked: string; // ********0211
  dateISO: string; // 2024-12-09
  category: string; // "Car", "Groceries", "Salary"
  amount: number; // - expense, + income
  currency: CurrencyCode;
};

export type DashboardResponse = {
  period: Period;
  currency: CurrencyCode;
  totalBalance: BalancePoint[];
  incomeExpenses: IEPoint[];
  receiptsSplit: { total: number; groups: Slice[] };
  categories: Slice[]; // already top-N + "Others"
  latestTransactions: TxRow[];
  updatedAt: string; // ISO
};

// ===== Raw mock data (as in the screenshot), but already aggregated =====
const MONTHS = [
  "2024-08",
  "2024-09",
  "2024-10",
  "2024-11",
  "2024-12",
  "2025-01",
  "2025-02",
] as const;

const BALANCE: BalancePoint[] = [
  { month: "2024-08", value: 4800 },
  { month: "2024-09", value: 5000 },
  { month: "2024-10", value: 4500 },
  { month: "2024-11", value: 6000 },
  { month: "2024-12", value: 5200 },
  { month: "2025-01", value: 5800 },
  { month: "2025-02", value: 6100 },
];

const INCOME_EXPENSES: IEPoint[] = [
  { month: "2024-08", income: 4300, expense: 2500 },
  { month: "2024-09", income: 4100, expense: 3000 },
  { month: "2024-10", income: 5200, expense: 2800 },
  { month: "2024-11", income: 6100, expense: 3600 },
  { month: "2024-12", income: 5000, expense: 4200 },
  { month: "2025-01", income: 4500, expense: 3100 },
  { month: "2025-02", income: 5600, expense: 3300 },
];

const RECEIPTS = {
  total: 2800,
  groups: [
    { id: "food", label: "Food", value: 1600, color: "#22c55e" },
    { id: "non-food", label: "Non-food", value: 1400, color: "#ef4444" },
  ] as Slice[],
};

const CATEGORY_SLICES: Slice[] = [
  { id: "groceries", label: "Groceries", value: 500, color: "#3b82f6" },
  { id: "utilities", label: "Utilities", value: 400, color: "#60a5fa" },
  { id: "car", label: "Car", value: 150, color: "#93c5fd" },
  { id: "savings", label: "Savings", value: 120, color: "#10b981" },
  { id: "education", label: "Education", value: 120, color: "#34d399" },
  { id: "withdraw", label: "Withdraw", value: 80, color: "#f59e0b" },
  { id: "transfer", label: "Transfer", value: 70, color: "#f97316" },
  { id: "pharmacy", label: "Pharmacy", value: 70, color: "#a78bfa" },
  { id: "entertainment", label: "Entertainment", value: 70, color: "#f472b6" },
  { id: "misc", label: "Miscellaneous", value: 50, color: "#f43f5e" },
  { id: "transport", label: "Transport", value: 25, color: "#22d3ee" },
  { id: "beauty", label: "Beauty", value: 25, color: "#14b8a6" },
];

const TXS: TxRow[] = [
  {
    id: "t1",
    cardMasked: "********0211",
    dateISO: "2024-12-09",
    category: "Car",
    amount: -129.0,
    currency: "usd", 
  },
  {
    id: "t2",
    cardMasked: "********0211",
    dateISO: "2024-12-08",
    category: "Groceries",
    amount: -150.0,
    currency: "usd",
  },
  {
    id: "t3",
    cardMasked: "********1077",
    dateISO: "2024-11-30",
    category: "Salary",
    amount: 350.0,
    currency: "usd",
  },
  {
    id: "t4",
    cardMasked: "********0211",
    dateISO: "2024-12-05",
    category: "Utilities",
    amount: -85.0,
    currency: "usd",
  },
  {
    id: "t5",
    cardMasked: "********0211",
    dateISO: "2024-12-02",
    category: "Pharmacy",
    amount: -32.5,
    currency: "usd",
  },
];

// ===== Helpers =====
function toDate(d: string) {
  // d: YYYY-MM or YYYY-MM-DD
  const iso = d.length === 7 ? `${d}-01` : d;
  return new Date(iso + "T00:00:00");
}

function inPeriod(dateISO: string, period?: Period) {
  if (!period?.from && !period?.to) return true;
  const t = toDate(dateISO).getTime();
  const from = period?.from ? toDate(period.from).getTime() : -Infinity;
  const to = period?.to ? toDate(period.to).getTime() : Infinity;
  return t >= from && t <= to;
}

function filterSeriesByPeriod<T extends { month: string }>(
  series: T[],
  period?: Period
) {
  if (!period?.from && !period?.to) return series;
  return series.filter((p) => inPeriod(p.month, period));
}

function topNSlices(slices: Slice[], n = 10): Slice[] {
  const sorted = [...slices].sort((a, b) => b.value - a.value);
  if (sorted.length <= n) return sorted;
  const top = sorted.slice(0, n);
  const othersTotal = sorted.slice(n).reduce((s, x) => s + x.value, 0);
  if (othersTotal > 0) {
    top.push({
      id: "others",
      label: "Others",
      value: othersTotal,
      color: "#94a3b8", // slate-400
    });
  }
  return top;
}

// ===== Public mocks API =====
export function getDashboardMock(
  period?: Period,
  opts?: {
    topCategories?: number;
    includeLatest?: number;
    currency: CurrencyCode;
  }
): DashboardResponse {
  const effective: Period = {
    from: period?.from ?? `${MONTHS[0]}-01`,
    to: period?.to ?? `${MONTHS[MONTHS.length - 1]}-28`,
  };

  return {
    period: effective,
    currency: opts?.currency ?? "usd",
    totalBalance: filterSeriesByPeriod(BALANCE, effective),
    incomeExpenses: filterSeriesByPeriod(INCOME_EXPENSES, effective),
    receiptsSplit: RECEIPTS,
    categories: topNSlices(CATEGORY_SLICES, opts?.topCategories ?? 10),
    latestTransactions: TXS.filter((tx) =>
      inPeriod(tx.dateISO, effective)
    ).slice(0, opts?.includeLatest ?? 5),
    updatedAt: new Date().toISOString(),
  };
}

// Helper for links with period (?from=&to=)
export function withPeriod(base: string, p?: Period) {
  if (!p?.from && !p?.to) return base;
  const qs = new URLSearchParams();
  if (p?.from) qs.set("from", p.from);
  if (p?.to) qs.set("to", p.to);
  return `${base}?${qs.toString()}`;
}
