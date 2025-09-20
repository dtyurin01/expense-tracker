"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";

const pillVariants = cva("inline-flex items-center rounded-lg font-medium", {
  variants: {
    size: {
      xs: "px-1.5 py-0.5 text-xs",
      sm: "px-2.5 py-0.5 text-sm",
      md: "px-2.5 py-1 text-sm",
      lg: "px-3 py-1 text-base",
      xl: "px-4 py-1.5 text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

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
        backgroundColor: color ? `${color}20` : "var(--color-surface)",
        color: color ?? "var(--color-foreground)",
        border: color
          ? `1px solid ${color}60`
          : "1px solid var(--color-border)",
        ...style,
      }}
      {...props}
    >
      {children}
    </Comp>
  );
}
