"use client";

import * as React from "react";
import { Chart } from "chart.js/auto";
import { ChartCanvas } from "@/features/charts/ChartCanvas";
import { useChartData } from "@/features/charts/hooks/useChartData";
import { createXAxis, createYAxis } from "@/features/charts/config/axes";
import {
  chartColors,
  createAreaGradient,
} from "@/features/charts/config/colors";
import { formatMoney } from "@/lib/format";
import type { CurrencyCode } from "@/lib/currencies";
import type { BalancePoint } from "@/mocks/dashboard";

import {
  createOrUpdateChart,
  destroyChart,
} from "@/features/charts/utils/chartKit";

type AreaChartProps = {
  data: BalancePoint[];
  currency: CurrencyCode;
  colorScheme?: keyof typeof chartColors.area;
  label?: string;
};

export function AreaChart({
  data,
  currency = "usd",
  colorScheme = "orange",
  label = "Total Balance",
}: AreaChartProps) {
  const { labels, values, suggestedMax, suggestedMin } = useChartData(
    data,
    currency
  );

  const chartRef = React.useRef<Chart<"line"> | null>(null);

  const onReady = React.useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const colors = chartColors.area[colorScheme];

      const gradient = createAreaGradient(
        ctx,
        canvas,
        colors.gradientStart,
        colors.gradientEnd
      );

      createOrUpdateChart(chartRef, canvas, {
        type: "line",
        labels,
        datasets: [
          {
            label,
            data: values,
            fill: true,
            backgroundColor: gradient,
            borderColor: colors.border,
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: "rgba(255,255,255,0.95)",
            pointBorderColor: colors.point,
            pointBorderWidth: 2,
            pointRadius: 4.5,
            pointHoverRadius: 5.5,
          },
        ],
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
            x: createXAxis(),
            y: createYAxis({
              currency,
              min: suggestedMin,
              max: suggestedMax,
            }),
          },
        },
      });

      return () => destroyChart(chartRef);
    },
    [currency, colorScheme, label, labels, values, suggestedMax, suggestedMin]
  );

  return <ChartCanvas onReady={onReady} />;
}
