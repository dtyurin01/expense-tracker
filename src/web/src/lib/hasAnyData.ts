import { DashboardResponse } from "@/mocks/dashboard";

export function hasAnyData(resp: DashboardResponse) {
  return (
    (resp.totalBalance?.length ?? 0) > 0 ||
    (resp.incomeExpenses?.length ?? 0) > 0 ||
    (resp.latestTransactions?.length ?? 0) > 0
  );
}
