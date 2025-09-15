"use client";

import * as React from "react";

export type ChartCanvasProps = {
  className?: string;
  onReady: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
};

export function ChartCanvas({ className, onReady }: ChartCanvasProps) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    onReady(ctx, canvas);
  }, [onReady]);

  return <canvas ref={ref} className={className ?? "h-full w-full"} />;
}
