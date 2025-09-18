"use client";

import * as React from "react";
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartCanvas } from "@/features/charts/ChartCanvas";
import { createXAxis, createYAxis } from "@/features/charts/config/axes";
import { chartColors } from "@/features/charts/config/colors";
import { formatMoney } from "@/lib/format";
import type { CurrencyCode } from "@/lib/currencies";
import type { IEPoint } from "@/mocks/dashboard";
import { useChartData } from "../hooks/useChartData";

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

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

  const onReady = React.useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      Chart.getChart(canvas)?.destroy();

      const colors = chartColors.bar;

      const chart = new Chart(ctx, {
        type: "bar",
        data: {
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
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: showLegend,
              position: "top",
              labels: { usePointStyle: true, pointStyle: "rectRounded" },
            },
            tooltip: {
              callbacks: {
                label: (c) =>
                  `${c.dataset.label}: ${formatMoney(
                    Number(c.parsed.y),
                    currency
                  )}`,
              },
            },
          },
          scales: {
            x: createXAxis(),
            y: createYAxis({ currency, min: 0, max: suggestedMax }),
          },
        },
      });

      return () => chart.destroy();
    },
    [labels, currency, suggestedMax, showLegend, expenseValues, incomeValues]
  );

  return <ChartCanvas onReady={onReady} />;
}
