"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const trackVariants = cva(
  "relative inline-flex cursor-pointer items-center justify-start rounded-full transition-colors " +
    "bg-border/60 data-[state=checked]:bg-brand " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 " +
    "disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-12",
      },
    },
    defaultVariants: { size: "md" },
  }
);
const thumbBase =
  "pointer-events-none block rounded-full bg-surface shadow transition-transform will-change-transform " +
  "translate-x-0.5";

const thumbSize = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const;

const thumbTranslateChecked = {
  sm: "data-[state=checked]:translate-x-4.5",
  md: "data-[state=checked]:translate-x-5.5",
  lg: "data-[state=checked]:translate-x-5.5",
} as const;

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof trackVariants> {
  className?: string;
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size, ...props }, ref) => {
  const s = size ?? "md";
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(trackVariants({ size: s }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(thumbBase, thumbSize[s], thumbTranslateChecked[s])}
      />
    </SwitchPrimitive.Root>
  );
});
Switch.displayName = "Switch";
