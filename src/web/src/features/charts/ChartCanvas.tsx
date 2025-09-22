"use client";

import * as React from "react";
import { initChartDefaultsFromCSS } from "@/features/charts/utils/chartKit";

let __chartDefaultsInited = false;

export function ChartCanvas({
  onReady,
  className,
}: {
  onReady?: (
    ctx: CanvasRenderingContext2D,
    el: HTMLCanvasElement
  ) => void | (() => void);
  className?: string;
}) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const disposeRef = React.useRef<VoidFunction | null>(null);

  React.useEffect(() => {
    if (!__chartDefaultsInited) {
      initChartDefaultsFromCSS();
      __chartDefaultsInited = true;
    }
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !onReady) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    disposeRef.current?.();
    const d = onReady(ctx, el);
    disposeRef.current = typeof d === "function" ? d : null;

    return () => {
      disposeRef.current?.();
      disposeRef.current = null;
    };
  }, [onReady]);

  return <canvas ref={ref} className={className} />;
}
