import { getCurrency } from "@/lib/format";
import { type CurrencyCode } from "@/lib/currencies";
import type { Scale, CoreScaleOptions } from "chart.js";

export function createYAxis(options: {
  currency?: CurrencyCode;
  min?: number;
  max?: number;
  stepSize?: number;
}) {
  const { currency = "usd", min = 0, max, stepSize = 1000 } = options;
  const curr = getCurrency(currency);
  const sym = curr?.label ?? "";

  return {
    grid: { color: "rgba(148,163,184,0.18)" },
    border: { display: false },
    ticks: {
      color: "rgba(148,163,184,0.9)",
      stepSize,
      callback: function (
        this: Scale<CoreScaleOptions>,
        tickValue: string | number
      ) {
        return `${sym} ${Number(tickValue) / 1000}k`;
      },
    },
    suggestedMin: min,
    suggestedMax: max,
  };
}

export function createXAxis() {
  return {
    grid: { display: false },
    ticks: {
      color: "rgba(148,163,184,0.9)",
      maxRotation: 0,
      autoSkip: true,
    },
    border: { display: false },
  };
}
