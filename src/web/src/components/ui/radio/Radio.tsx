"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const RadioGroup = RadioGroupPrimitive.Root;

const radioItemVariants = cva(
  "peer inline-flex items-center justify-center rounded-full border border-border bg-surface " +
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 " +
    "data-[state=checked]:border-brand disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        xs: "size-4",
        sm: "size-4",
        md: "size-5",
        lg: "size-6",
      },
    },
    defaultVariants: { size: "md" },
  }
);

const dotSize = {
  xs: "size-2",
  sm: "size-2",
  md: "size-2.5",
  lg: "size-3.5",
} as const;

export interface RadioProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioItemVariants> {
  className?: string;
}

export const Radio = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioProps
>(({ className, size, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioItemVariants({ size }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={cn("rounded-full bg-brand", dotSize[size ?? "md"])}
      />
    </RadioGroupPrimitive.Item>
  );
});
Radio.displayName = "Radio";
