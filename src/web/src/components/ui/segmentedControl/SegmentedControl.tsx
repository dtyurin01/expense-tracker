"use client";
import * as React from "react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/lib/cn";

type SegmentedControlProps = {
  options: string[];
  value: string;
  onChange?: (v: string) => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "icon";
  radius?: "sm" | "md" | "lg" | "full";
  className?: string;
  block?: boolean; 
  equal?: boolean; 
};

export function SegmentedControl({
  options,
  value,
  onChange,
  size = "sm",
  radius = "lg",
  className,
  block = false,
  equal = false,
}: SegmentedControlProps) {
  return (
    <div
      role="tablist"
      aria-label="Segments"
      className={cn(
        "inline-flex items-center rounded-2xl border border-border bg-surface/60 p-0.5",
        block && "w-full", 
        className
      )}
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <Button
            key={opt}
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(opt)}
            variant={active ? "secondary" : "ghost"}
            size={size}
            radius={radius}
            className={cn(
              "px-3",
              equal && "flex-1", 
              active ? "font-medium" : "text-muted-foreground"
            )}
          >
            {opt}
          </Button>
        );
      })}
    </div>
  );
}
