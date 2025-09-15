// src/mocks/dashboard.ts

// === API response types (as from backend) ===
export type Period = { from?: string; to?: string };

export type BalancePoint = { month: string; value: number }; // Total balance (area)
export type IEPoint = { month: string; income: number; expense: number }; // Income & Expenses (bars)
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
  amount: number; // - = expense, + = income
  currency: "USD" | "EUR";
};

export type DashboardResponse = {
  period: Period; // period applied by the server
  currency: "USD";
  timezone: string; // user's timezone used for aggregation
  generatedAt: string;

  totalBalance: BalancePoint[]; // series for AreaChart
  incomeExpenses: IEPoint[]; // series for BarChart

  receiptsSplit: {
    // donut for "Receipts split summary"
    total: number;
    groups: Slice[]; // for example: [{id:"food", value:1600}, {id:"non-food", value:1400}]
  };

  categories: {
    // "Spending categories"
    slices: Slice[]; // full slice (for legend/table)
    top: Slice[]; // top-N (for donut)
    others?: { label: string; value: number }; // aggregated "Others" tail
  };

  latestTransactions: {
    // "Latest transactions" table
    rows: TxRow[];
    pageInfo: { page: number; pageSize: number; total: number };
  };
};

// === Mock aggregated data (ready for charts) ===

const balance: BalancePoint[] = [
  { month: "Aug", value: 4800 },
  { month: "Sep", value: 5000 },
  { month: "Oct", value: 4500 },
  { month: "Nov", value: 6000 },
  { month: "Dec", value: 5200 },
  { month: "Jan", value: 5800 },
  { month: "Feb", value: 6100 },
];

const incomeExpenses: IEPoint[] = [
  { month: "Aug", income: 4300, expense: 2500 },
  { month: "Sep", income: 4100, expense: 3000 },
  { month: "Oct", income: 5200, expense: 2800 },
  { month: "Nov", income: 6100, expense: 3600 },
  { month: "Dec", income: 5000, expense: 4200 },
  { month: "Jan", income: 4500, expense: 3100 },
  { month: "Feb", income: 5600, expense: 3300 },
];

// To match the card text: Food $1600 · Non-food $1400
const receiptsSplit = {
  total: 3000,
  groups: [
    { id: "food", label: "Food", value: 1600, color: "#22c55e" },
    { id: "non-food", label: "Non-food", value: 1400, color: "#ef4444" },
  ] as Slice[],
};

// Full list of categories (legend) — as on the screenshot
const categorySlices: Slice[] = [
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

// helper for top-N with 'Others'
function topNWithOthers(slices: Slice[], n: number) {
  const sorted = [...slices].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, n);
  const rest = sorted.slice(n);
  const othersValue = rest.reduce((sum, s) => sum + s.value, 0);
  const others =
    othersValue > 0 ? { label: "Others", value: othersValue } : undefined;
  return { top, others };
}

const { top: categoriesTop, others: categoriesOthers } = topNWithOthers(
  categorySlices,
  10
);

// Latest transactions (server already filtered by period and sorted)
const latestRows: TxRow[] = [
  {
    id: "t1",
    cardMasked: "********0211",
    dateISO: "2024-12-09",
    category: "Car",
    amount: -129.0,
    currency: "USD",
  },
  {
    id: "t2",
    cardMasked: "********0211",
    dateISO: "2024-12-08",
    category: "Groceries",
    amount: -150.0,
    currency: "USD",
  },
  {
    id: "t3",
    cardMasked: "********1077",
    dateISO: "2024-11-30",
    category: "Salary",
    amount: 350.0,
    currency: "USD",
  },
  {
    id: "t4",
    cardMasked: "********0211",
    dateISO: "2024-12-05",
    category: "Utilities",
    amount: -85.0,
    currency: "USD",
  },
  {
    id: "t5",
    cardMasked: "********0211",
    dateISO: "2024-12-02",
    category: "Pharmacy",
    amount: -32.5,
    currency: "USD",
  },
];

// === Export 'as from backend' ===

export const dashboardMock: DashboardResponse = {
  period: { from: "2024-08-01", to: "2025-02-28" },
  currency: "USD",
  timezone: "America/New_York",
  generatedAt: new Date().toISOString(),

  totalBalance: balance,
  incomeExpenses,

  receiptsSplit,

  categories: {
    slices: categorySlices,
    top: categoriesTop,
    others: categoriesOthers,
  },

  latestTransactions: {
    rows: latestRows.slice(0, 3), // as if page=1&pageSize=3
    pageInfo: { page: 1, pageSize: 3, total: latestRows.length },
  },
};

// (optional) 'request simulation' — convenient to use with SWR/React Query
export async function fetchDashboardMock(
  _period?: Period
): Promise<DashboardResponse> {
  // you can modify data here depending on _period
  return dashboardMock;
}
