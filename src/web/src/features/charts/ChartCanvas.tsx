"use client";

import * as React from "react";
import { initChartDefaultsFromCSS } from "@/features/charts/utils/chartKit";

let __chartDefaultsInited = false;

type ChartCanvasProps = {
  onReady?: (
    ctx: CanvasRenderingContext2D,
    el: HTMLCanvasElement
  ) => void | (() => void);
  className?: string;
  height?: number | string;
};

export function ChartCanvas({
  onReady,
  className,
  height = "95%",
}: ChartCanvasProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const disposeRef = React.useRef<VoidFunction | null>(null);

  React.useEffect(() => {
    if (!__chartDefaultsInited) {
      initChartDefaultsFromCSS();
      __chartDefaultsInited = true;
    }
  }, []);

  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el || !onReady) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    disposeRef.current?.();
    const d = onReady(ctx, el);
    disposeRef.current = typeof d === "function" ? d : null;

    const ro = new ResizeObserver(() => {
      window.dispatchEvent(new Event("resize"));
    });

    if (wrapRef.current) ro.observe(wrapRef.current);

    return () => {
      ro.disconnect();
      disposeRef.current?.();
      disposeRef.current = null;
    };
  }, [onReady]);

  const style = {
    width: "100%",
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div ref={wrapRef} className={className} style={style}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
