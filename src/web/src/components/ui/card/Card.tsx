"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";
import { cardVariants, type CardVariantProps } from "./card.variants";

export type CardProps = React.ComponentPropsWithoutRef<"div"> &
  CardVariantProps & {
    asChild?: boolean;
  };

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ asChild, className, elevation, divided, interactive, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(
          cardVariants({ elevation, divided, interactive }),
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export type CardSectionProps = React.ComponentPropsWithoutRef<"div">;

export const CardHeader = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-4 py-3 flex items-center justify-between gap-3",
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-base font-semibold leading-none", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLDivElement,
  CardSectionProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 py-3", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-4 py-3 flex items-center justify-between",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export const CardActions = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center ", className)}
      {...props}
    />
  )
);
CardActions.displayName = "CardActions";
