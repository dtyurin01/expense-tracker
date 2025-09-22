import {
  Chart,
  ChartConfigurationCustomTypesPerDataset,
  ChartData,
  type ChartConfiguration,
  type ChartDataset,
  type ChartOptions,
  type ChartType,
  type Plugin,
} from "chart.js/auto";

export function cssVar(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

export function mix(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

function isRootTypedConfig<T extends ChartType>(
  cfg: ChartConfiguration<T> | ChartConfigurationCustomTypesPerDataset<T>
): cfg is ChartConfiguration<T> {
  return typeof (cfg as ChartConfiguration<T>).type === "string";
}

function getConfigChartType<T extends ChartType>(
  cfg: ChartConfiguration<T> | ChartConfigurationCustomTypesPerDataset<T>
): ChartType | undefined {
  if (isRootTypedConfig(cfg)) {
    return cfg.type;
  }
  const data = cfg.data as { datasets?: ChartDataset<T>[] };
  const first = data.datasets?.[0];
  return first?.type ?? undefined;
}

export type ChartKitConfig<TType extends ChartType = ChartType> = {
  type: TType;
  labels: Array<string>;
  /** Datasets in full (we don't patch in place; we replace the entire array — more reliable) */
  datasets: Array<ChartDataset<TType>>;
  /** Full Chart.js options (axes, legend, tooltips, etc.) */
  options?: ChartOptions<TType>;
  /** Plugins (for example, center text for donut) */
  plugins?: Plugin<TType>[];
  /** Update animation mode (default: "normal") */
  updateMode?: "normal" | "none" | "reset" | "resize";
};
export function createOrUpdateChart<TType extends ChartType>(
  chartRef: React.RefObject<Chart<TType> | null>,
  canvas: HTMLCanvasElement,
  cfg: ChartKitConfig<TType>
) {
  const current = chartRef.current;

  if (current) {
    const currentType = getConfigChartType(current.config);
    if (currentType && currentType !== cfg.type) {
      current.destroy();
      chartRef.current = null;
    }
  }

  if (!chartRef.current) {
    chartRef.current = new Chart(canvas, {
      type: cfg.type,
      data: { labels: cfg.labels, datasets: cfg.datasets },
      options: cfg.options,
      plugins: cfg.plugins,
    });
    return chartRef.current;
  }

  const chart = chartRef.current;
  const data = chart.data as ChartData<TType>;
  data.labels = cfg.labels;
  data.datasets = cfg.datasets;

  if (cfg.options) {
    chart.options = cfg.options;
  }
  chart.update();
  return chart;
}

export function destroyChart<T extends ChartType>(
  chartRef: React.RefObject<Chart<T> | null>
): void {
  chartRef.current?.destroy();
  chartRef.current = null;
}

export function initChartDefaultsFromCSS() {
  if (typeof window === "undefined") return;

  const bodyFF = getComputedStyle(document.body).fontFamily;
  Chart.defaults.font.family =
    bodyFF || "system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif";
}
