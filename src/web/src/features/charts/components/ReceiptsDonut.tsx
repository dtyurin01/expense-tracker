"use client";

import * as React from "react";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartDataset,
  ChartConfiguration,
} from "chart.js";
import { ChartCanvas } from "@/features/charts/ChartCanvas";
import { formatMoney } from "@/lib/format";
import type { CurrencyCode } from "@/lib/currencies";
import type { Slice } from "@/mocks/dashboard";
import { chartColors } from "@/features/charts/config/colors";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

type Props = {
  data: { total: number; groups: Slice[] };
  currency: CurrencyCode;
  showLegend?: boolean;
  cutout?: string | number;
};

export function ReceiptsDonut({
  data,
  currency,
  showLegend = true,
  cutout = "70%",
}: Props) {
  const areaColors = chartColors.donut;
  const labels = React.useMemo(() => data.groups.map((g) => g.label), [data]);
  const values = React.useMemo(() => data.groups.map((g) => g.value), [data]);
  const colors = React.useMemo(
    () => data.groups.map((g) => g.color || "#9ca3af"),
    [data]
  );

  const centerText = React.useMemo(
    () => ({
      id: "center-text",
      afterDraw(chart: Chart) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        const midX = (chartArea.left + chartArea.right) / 2;
        const midY = (chartArea.top + chartArea.bottom) / 2;

        const style = getComputedStyle(chart.canvas);
        const color = style.getPropertyValue("--color-foreground")?.trim();
        ctx.save();
        const family = style.fontFamily;
        const sizePx = 14;
        ctx.font = `600 ${sizePx}px ${family}`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(formatMoney(data.total, currency), midX, midY);
        ctx.restore();
      },
    }),
    [data.total, currency]
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
              backgroundColor: colors,
              borderWidth: 0,
              hoverOffset: 6,
              spacing: 1,
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
              position: "top",
              labels: {
                usePointStyle: true,
                pointStyle: "rectRounded",
                generateLabels(chart) {
                  const ds = chart.data.datasets[0] as ChartDataset<
                    "doughnut",
                    number[]
                  >;
                  const bg = (ds.backgroundColor ?? []) as Array<
                    string | CanvasPattern | CanvasGradient
                  >;

                  return chart.data.labels!.map((lbl, i) => {
                    const text = `${String(lbl)} ${formatMoney(
                      Number(ds.data[i]),
                      currency
                    )}`;
                    const color = Array.isArray(bg) ? bg[i] ?? areaColors : bg;
                    return {
                      text,
                      fillStyle: color,
                      strokeStyle: color,
                      fontColor: areaColors.text,
                      lineWidth: 0,
                      hidden: !chart.getDataVisibility(i),
                      index: i,
                    };
                  });
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (c) =>
                  `${c.label}: ${formatMoney(Number(c.parsed), currency)}`,
              },
            },
          },
          animation: { duration: 600 },
        } satisfies ChartOptions<"doughnut">,
        plugins: [centerText],
      };

      const chart = new Chart(ctx, cfg);
      return () => chart.destroy();
    },
    [
      labels,
      values,
      colors,
      cutout,
      showLegend,
      centerText,
      currency,
      areaColors,
    ]
  );

  return <ChartCanvas onReady={onReady} />;
}
