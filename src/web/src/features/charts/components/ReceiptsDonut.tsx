"use client";

import * as React from "react";
import { Chart } from "chart.js/auto";
import type {
  Chart as ChartJS,
  ChartDataset,
  LegendItem,
  Plugin,
} from "chart.js";
import { ChartCanvas } from "@/features/charts/ChartCanvas";
import { formatMoney } from "@/lib/format";
import type { CurrencyCode } from "@/lib/currencies";
import type { Slice } from "@/mocks/dashboard";
import { chartColors } from "@/features/charts/config/colors";
import {
  createOrUpdateChart,
  destroyChart,
} from "@/features/charts/utils/chartKit";

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

  const chartRef = React.useRef<Chart<"doughnut"> | null>(null);

  const centerText: Plugin<"doughnut"> = React.useMemo(
    () => ({
      id: "center-text",
      afterDraw(chart: ChartJS<"doughnut">) {
        const { ctx, chartArea, canvas } = chart;
        if (!ctx || !chartArea) return;

        const midX = (chartArea.left + chartArea.right) / 2;
        const midY = (chartArea.top + chartArea.bottom) / 2;

        const style = getComputedStyle(canvas);
        const color = style.getPropertyValue("--color-foreground").trim();
        const family = style.fontFamily || "system-ui, sans-serif";

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = color;
        ctx.font = `600 16px ${family}`;
        ctx.fillText(formatMoney(data.total, currency), midX, midY);

        ctx.restore();
      },
    }),
    [data.total, currency]
  );

  const onReady = React.useCallback(
    (_ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const generateLabels = (chart: ChartJS<"doughnut">): LegendItem[] => {
        const ds = chart.data.datasets[0] as ChartDataset<"doughnut", number[]>;
        const bg = ds.backgroundColor as
          | Array<string | CanvasGradient | CanvasPattern>
          | undefined;

        return (chart.data.labels ?? []).map((lbl, i) => {
          const text = `${String(lbl)} ${formatMoney(
            Number(ds.data[i]),
            currency
          )}`;
          const color = Array.isArray(bg) ? bg[i] ?? "#9ca3af" : bg;
          return {
            text,
            fillStyle: color ?? "#9ca3af",
            strokeStyle: color ?? "#9ca3af",
            lineWidth: 0,
            fontColor: areaColors.text,
            hidden: !chart.getDataVisibility(i),
            index: i,
          } as LegendItem;
        });
      };

      createOrUpdateChart(chartRef, canvas, {
        type: "doughnut",
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 0,
            hoverOffset: 6,
            borderRadius: 4,
            spacing: 1,
          } satisfies ChartDataset<"doughnut", number[]>,
        ],
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
                generateLabels,
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
        },
        plugins: [centerText],
      });

      return () => destroyChart(chartRef);
    },
    [
      labels,
      values,
      colors,
      cutout,
      showLegend,
      currency,
      areaColors.text,
      centerText,
    ]
  );

  return <ChartCanvas onReady={onReady} />;
}
