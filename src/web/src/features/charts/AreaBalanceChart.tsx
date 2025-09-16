"use client";

import * as React from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartCanvas } from "@/features/charts/ChartCanvas";
import type { BalancePoint } from "@/mocks/dashboard";
import { formatMoney, getCurrency, monthLabel } from "@/lib/format";
import { type CurrencyCode } from "@/lib/currencies";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
);

type Props = {
  data: BalancePoint[];
  currency?: CurrencyCode;
};

// TODO: GET currency from user profile (context)
export function AreaBalanceChart({ data, currency = "usd" }: Props) {
  const onReady = React.useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      Chart.getChart(canvas)?.destroy()
      const nowShort = new Date().toLocaleString(undefined, { month: "short" });

      const labels = data.map((d) => {
        const m = monthLabel(d.month);
        return m === nowShort ? "Now" : m;
      });

      const values = data.map((d) => d.value);

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(251,191,36,0.35)"); // amber-400/35
      gradient.addColorStop(1, "rgba(251,191,36,0.06)"); // amber-400/6

      const max = Math.max(...values);
      const suggestedMax = Math.ceil(Math.max(max, 7000) / 1000) * 1000;
      const suggestedMin = 1000;

      const curr = getCurrency(currency);
      const sym = curr?.label ?? "";

      const chart = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Balance",
              data: values,
              fill: true,
              backgroundColor: gradient,
              borderColor: "rgb(249,115,22)", // orange-500
              borderWidth: 3,
              tension: 0.4,
              pointBackgroundColor: "rgba(255,255,255,0.95)",
              pointBorderColor: "rgb(249,115,22)",
              pointBorderWidth: 2,
              pointRadius: 4.5,
              pointHoverRadius: 5.5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              displayColors: false,
              callbacks: {
                label: (c) => formatMoney(Number(c.parsed.y), currency),
              },
            },
          },
          elements: { line: { capBezierPoints: true } },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                color: "rgba(148,163,184,0.9)",
                maxRotation: 0,
                autoSkip: true,
              },
              border: { display: false },
            },
            y: {
              grid: {
                color: "rgba(148,163,184,0.18)",
              },
              border: { display: false },
              ticks: {
                color: "rgba(148,163,184,0.9)",
                stepSize: 1000,
                callback: (v) => `${sym}${Number(v) / 1000}k`,
              },
              suggestedMin,
              suggestedMax,
            },
          },
        },
      });
      return () => chart.destroy();
    },
    [data, currency]
  );
  return <ChartCanvas onReady={onReady} />;
}
