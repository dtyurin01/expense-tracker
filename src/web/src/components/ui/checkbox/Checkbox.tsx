"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const checkboxVariants = cva(
  "peer inline-flex shrink-0 items-center justify-center transition-colors " +
    "border border-border bg-surface text-foreground " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 " +
    "data-[state=checked]:border-brand data-[state=checked]:text-brand " +
    "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        xs: "size-4 rounded-[3px]",
        sm: "size-4 rounded-[4px]",
        md: "size-5 rounded-[6px]",
        lg: "size-6 rounded-[6px]",
      },
    },
    defaultVariants: { size: "md" },
  }
);

const checkIconSize = {
  xs: "size-3",
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4",
} as const;

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  className?: string;
}

export const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(checkboxVariants({ size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator asChild>
        <svg
          viewBox="0 0 24 24"
          className={cn(checkIconSize[size ?? "md"])}
          aria-hidden="true"
        >
          <path
            d="M5 12.5 10 17l9-10"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = "Checkbox";
