"use client";

import * as React from "react";
import { Chart } from "chart.js/auto";
import type { Chart as ChartJS, LegendItem } from "chart.js";
import { ChartCanvas } from "@/features/charts/ChartCanvas";
import { formatMoney } from "@/lib/format";
import type { CurrencyCode } from "@/lib/currencies";
import type { Slice } from "@/mocks/dashboard";
import { chartColors } from "@/features/charts/config/colors";
import {
  createOrUpdateChart,
  destroyChart,
} from "@/features/charts/utils/chartKit";
import {
  DONUT_COMPACT_VIEWPORT_MAX_WIDTH,
  MAX_VIEWPORT_LEGEND_ITEMS,
} from "@/config/ui.constants";

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

  const chartRef = React.useRef<Chart<"doughnut"> | null>(null);

  const [isCompactViewport, setIsCompactViewport] = React.useState(false);

  React.useEffect(() => {
    const updateViewportMode = () =>
      setIsCompactViewport(
        window.innerWidth < DONUT_COMPACT_VIEWPORT_MAX_WIDTH
      );

    updateViewportMode();

    window.addEventListener("resize", updateViewportMode);
    return () => window.removeEventListener("resize", updateViewportMode);
  }, []);

  const onReady = React.useCallback(
    (_ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const generateLabels = (chart: ChartJS<"doughnut">): LegendItem[] => {
        const ds = chart.data.datasets[0];
        const bg = ds.backgroundColor;
        const chartLabels = chart.data.labels ?? [];

        const allItems = chartLabels.map((lbl, i) => {
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
          };
        });

        if (isCompactViewport) {
          return allItems.slice(0, MAX_VIEWPORT_LEGEND_ITEMS);
        }

        return allItems;
      };

      createOrUpdateChart(chartRef, canvas, {
        type: "doughnut",
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 0,
            borderAlign: "inner",
            borderRadius: 4,
            spacing: 1,
            hoverOffset: 6,
            hoverBorderWidth: 0,
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout,

          plugins: {
            legend: {
              display: showLegend,
              position: isCompactViewport ? "bottom" : "left",
              align: "center",
              labels: {
                usePointStyle: true,
                pointStyle: "rectRounded",
                padding: 14,
                color: "var(--color-foreground)",
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
      isCompactViewport,
    ]
  );

  return <ChartCanvas onReady={onReady} />;
}
