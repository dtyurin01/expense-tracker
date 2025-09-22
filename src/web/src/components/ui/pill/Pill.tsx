"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";
import { type VariantProps } from "class-variance-authority";

import { pillVariants } from "@/components/ui/pill/pill.variants";

export interface PillProps
  extends React.ComponentPropsWithoutRef<"span">,
    VariantProps<typeof pillVariants> {
  asChild?: boolean;
  color?: string;
}

export function Pill({
  asChild,
  color,
  children,
  className,
  size,
  style,
  ...props
}: PillProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      className={cn(pillVariants({ size }), className)}
      style={{
        backgroundColor: color
          ? `color-mix(in srgb, ${color} 12.5%, transparent)`
          : "var(--color-surface)",
        color: color ?? "var(--color-foreground)",
        border: color
          ? `1px solid color-mix(in srgb, ${color} 37.5%, transparent)`
          : "1px solid var(--color-border)",
        ...style,
      }}
      {...props}
    >
      {children}
    </Comp>
  );
}
