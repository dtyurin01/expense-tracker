"use client";

import * as React from "react";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  type ChartConfiguration,
  type ChartDataset,
  type ChartOptions,
} from "chart.js";
import { ChartCanvas } from "@/features/charts/ChartCanvas";
import { formatMoney } from "@/lib/format";
import type { CurrencyCode } from "@/lib/currencies";
import type { Slice } from "@/mocks/dashboard";
import { chartColors } from "@/features/charts/config/colors";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

type Props = {
  data: Slice[];
  currency: CurrencyCode;
  showLegend?: boolean;
  cutout?: string | number;
};

export function CategoriesDonut({
  data,
  currency,
  showLegend = true,
  cutout = "60%",
}: Props) {
  const areaColors = chartColors.donut;
  const labels = React.useMemo(() => data.map((g) => g.label), [data]);
  const values = React.useMemo(() => data.map((g) => g.value), [data]);
  const colors = React.useMemo(
    () => data.map((g) => g.color ?? "#9ca3af"),
    [data]
  );

  const onReady = React.useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      Chart.getChart(canvas)?.destroy();

      const cfg: ChartConfiguration<"doughnut", number[], string> = {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors, // string[]
              borderWidth: 0,
              borderAlign: "inner",
              borderRadius: 4,
              spacing: 1,
              hoverOffset: 6,
              hoverBorderWidth: 0,
            } satisfies ChartDataset<"doughnut", number[]>,
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout,
          plugins: {
            legend: {
              display: showLegend,
              position: "left",
              labels: {
                usePointStyle: true,
                pointStyle: "rectRounded",
                padding: 14,
                color: "var(--color-foreground)",
                generateLabels(chart) {
                  const ds = chart.data.datasets[0] as ChartDataset<
                    "doughnut",
                    number[]
                  >;
                  const bg = (ds.backgroundColor ?? []) as Array<
                    string | CanvasGradient | CanvasPattern
                  >;

                  return chart.data.labels!.map((lbl, i) => {
                    const text = `${String(lbl)} ${formatMoney(
                      Number(ds.data[i]),
                      currency
                    )}`;
                    const color = Array.isArray(bg) ? bg[i] ?? "#9ca3af" : bg;
                    return {
                      text,
                      fillStyle: color,
                      fontColor: areaColors.text,
                      strokeStyle: color,
                      lineWidth: 0,
                      hidden: !chart.getDataVisibility(i),
                      index: i,
                    };
                  });
                },
              },
            },
            tooltip: {
              displayColors: false,
              callbacks: {
                label: (c) =>
                  `${c.label}: ${formatMoney(Number(c.parsed), currency)}`,
              },
            },
          },
          animation: { duration: 600 },
        } satisfies ChartOptions<"doughnut">,
      };

      const chart = new Chart(ctx, cfg);
      return () => chart.destroy();
    },
    [labels, values, colors, cutout, showLegend, currency, areaColors.text]
  );

  return <ChartCanvas onReady={onReady} />;
}
