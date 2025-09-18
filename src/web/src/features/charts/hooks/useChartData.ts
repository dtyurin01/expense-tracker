import * as React from "react";
import { getCurrency, monthLabel } from "@/lib/format";
import type { CurrencyCode } from "@/lib/currencies";
import { BalancePoint } from "@/mocks/dashboard";

export function useChartData(
  data: BalancePoint[],
  currency: CurrencyCode = "usd"
) {
  return React.useMemo(() => {
    const nowShort = new Date().toLocaleString(undefined, { month: "short" });

    const labels = data.map((d) => {
      const m = monthLabel(d.month);
      return m === nowShort ? "Now" : m;
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
