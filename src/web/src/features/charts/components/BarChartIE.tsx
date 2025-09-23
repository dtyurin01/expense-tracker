"use client";

import * as React from "react";
import { Chart } from "chart.js/auto"; 
import { ChartCanvas } from "@/features/charts/ChartCanvas";
import { createXAxis, createYAxis } from "@/features/charts/config/axes";
import { chartColors } from "@/features/charts/config/colors";
import { formatMoney } from "@/lib/format";
import type { CurrencyCode } from "@/lib/currencies";
import type { IEPoint } from "@/mocks/dashboard";
import { useChartData } from "../hooks/useChartData";

// новая утилита
import {
  createOrUpdateChart,
  destroyChart,
} from "@/features/charts/utils/chartKit";

type Props = {
  data: IEPoint[];
  currency: CurrencyCode;
  showLegend?: boolean;
};

export function BarChartIE({
  data,
  currency = "usd",
  showLegend = true,
}: Props) {
  const incomeSeries = React.useMemo(
    () => data.map((d) => ({ month: d.month, value: d.income })),
    [data]
  );
  const expenseSeries = React.useMemo(
    () => data.map((d) => ({ month: d.month, value: d.expense })),
    [data]
  );

  const income = useChartData(incomeSeries, currency);
  const expenses = useChartData(expenseSeries, currency);

  const labels = income.labels;
  const incomeValues = income.values;
  const expenseValues = expenses.values;
  const suggestedMax = Math.max(income.suggestedMax, expenses.suggestedMax);

  const chartRef = React.useRef<Chart<"bar"> | null>(null);

  const onReady = React.useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const colors = chartColors.bar;
      const labelColors = chartColors.donut;

      createOrUpdateChart(chartRef, canvas, {
        type: "bar",
        labels,
        datasets: [
          {
            label: "Income",
            data: incomeValues,
            backgroundColor: colors.income,
            borderRadius: 2,
            categoryPercentage: 0.6,
            barPercentage: 0.9,
          },
          {
            label: "Expenses",
            data: expenseValues,
            backgroundColor: colors.expenses,
            borderRadius: 2,
            categoryPercentage: 0.6,
            barPercentage: 0.9,
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: showLegend,
              position: "top",
              labels: {
                usePointStyle: true,
                pointStyle: "rectRounded",
                color: labelColors.text,
              },
            },
            tooltip: {
              callbacks: {
                label: (c) =>
                  `${c.dataset.label}: ${formatMoney(
                    Number(c.parsed.y),
                    currency
                  )}`,
              },
              displayColors: false,
            },
          },
          scales: {
            x: createXAxis(),
            y: createYAxis({ currency, min: 0, max: suggestedMax }),
          },
        },
      });

      return () => destroyChart(chartRef);
    },
    [labels, incomeValues, expenseValues, currency, suggestedMax, showLegend]
  );

  return <ChartCanvas onReady={onReady} />;
}
