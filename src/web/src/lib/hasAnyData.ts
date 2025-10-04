import { DashboardResponse, Slice, TxRow } from "@/mocks/dashboard";

export function hasAnyData(resp: DashboardResponse) {
  return (
    (resp.totalBalance?.length ?? 0) > 0 ||
    (resp.incomeExpenses?.length ?? 0) > 0 ||
    (resp.latestTransactions?.length ?? 0) > 0
  );
}

export function hasAnyTx(resp: DashboardResponse): boolean {
  let list: TxRow[] = [];
  if (resp && resp.latestTransactions) {
    list = resp.latestTransactions;
  }

  if (list.length > 0) {
    return true;
  } else {
    return false;
  }
}

export function hasIncomeTx(resp: DashboardResponse): boolean {
  let list: TxRow[] = [];
  if (resp && resp.latestTransactions) {
    list = resp.latestTransactions;
  }

  for (const tx of list) {
    if (tx.amount > 0) {
      return true;
    }
  }
  return false;
}

export function hasExpenseTx(resp: DashboardResponse): boolean {
  let list: TxRow[] = [];
  if (resp && resp.latestTransactions) {
    list = resp.latestTransactions;
  }

  for (const tx of list) {
    if (tx.amount < 0) {
      return true;
    }
  }
  return false;
}

export function hasCategories(resp: DashboardResponse): boolean {
  let categories: Slice[] = [];
  if (resp && resp.categories) {
    categories = resp.categories;
  }

  let total: number = 0;
  for (const c of categories) {
    const value = typeof c.value === "number" ? c.value : 0;
    total = total + value;
  }

  if (categories.length > 0 && total > 0) {
    return true;
  } else {
    return false;
  }
}

export function hasTimeseries(resp: DashboardResponse): boolean {
  let balanceLen: number = 0;
  if (resp && resp.totalBalance) {
    balanceLen = resp.totalBalance.length;
  }

  let ieLen: number = 0;
  if (resp && resp.incomeExpenses) {
    ieLen = resp.incomeExpenses.length;
  }

  if (balanceLen > 0 || ieLen > 0) {
    return true;
  } else {
    return false;
  }
}

export function hasReceipts(resp: DashboardResponse): boolean {
  let groups: Slice[] = [];
  if (resp && resp.receiptsSplit && resp.receiptsSplit.groups) {
    groups = resp.receiptsSplit.groups;
  }

  let nonZeroGroups: number = 0;
  for (const g of groups) {
    const value = typeof g.value === "number" ? g.value : 0;
    if (value > 0) {
      nonZeroGroups = nonZeroGroups + 1;
    }
  }

  if (nonZeroGroups >= 2) {
    return true;
  } else {
    return false;
  }
}

export function hasSeries(resp: DashboardResponse): boolean {
  return (resp.incomeExpenses?.length ?? 0) > 0;
}

