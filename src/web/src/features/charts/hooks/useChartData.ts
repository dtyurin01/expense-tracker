import * as React from "react";
import { getCurrency, monthLabel } from "@/lib/format";
import type { CurrencyCode } from "@/lib/currencies";
import { BalancePoint } from "@/mocks/dashboard";

export function useChartData(
  data: BalancePoint[],
  currency: CurrencyCode = "usd"
) {
  return React.useMemo(() => {
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth() + 1;

    const labels = data.map((d) => {
      const [y, m] = d.month.split("-").map(Number);
      const isNow = y === nowYear && m === nowMonth;
      return isNow ? "Now" : monthLabel(d.month);
    });

    const values = data.map((d) => d.value);
    const max = Math.max(0, ...values);
    const min = Math.min(...values);

    const suggestedMax = Math.ceil(Math.max(max, 7000) / 1000) * 1000;
    const suggestedMin = Math.max(0, Math.floor((min - 1000) / 1000) * 1000);

    const curr = getCurrency(currency);
    const currencySymbol = curr?.label ?? "";

    return {
      labels,
      values,
      max,
      min,
      suggestedMax,
      suggestedMin,
      currencySymbol,
    };
  }, [data, currency]);
}
