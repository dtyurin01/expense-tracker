export const chartColors = {
  area: {
    orange: {
      border: "rgb(249,115,22)",
      point: "rgb(249,115,22)",
      gradientStart: "rgba(251,191,36,0.35)",
      gradientEnd: "rgba(251,191,36,0.06)",
    },
    blue: {
      border: "rgb(59,130,246)",
      point: "rgb(59,130,246)",
      gradientStart: "rgba(59,130,246,0.35)",
      gradientEnd: "rgba(59,130,246,0.06)",
    },
  },
  bar: {
    income: "rgb(59,130,246, 0.5)",
    expenses: "rgb(59,130,246)",
  },
  donut: {
    food: "rgb(34,197,94)",
    nonFood: "rgb(236,72,153)",
  },
  categories: [
    "#3b82f6",
    "#10b981",
    "#f97316",
    "#8b5cf6",
    "#ec4899",
    "#ef4444",
    "#6366f1",
    "#f59e0b",
  ],
};

export function createAreaGradient(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  startColor: string,
  endColor: string
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  return gradient;
}
