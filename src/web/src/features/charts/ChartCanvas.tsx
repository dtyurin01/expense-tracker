"use client";

import * as React from "react";

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
  }, []); 

  return <canvas ref={ref} className={className} />;
}
