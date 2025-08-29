"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";
import {
  buttonVariants,
  type ButtonVariantProps,
  iconSizeByButton,
} from "./button.variants";

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  ButtonVariantProps & {
    asChild?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

type AnyRef = React.Ref<HTMLElement>;

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      radius = "lg",
      block,
      asChild = false,
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      type = "button",
      onClick,
      ...props
    },
    ref: AnyRef
  ) => {
    const isDisabled = disabled || isLoading;
    const classes = cn(
      buttonVariants({ variant, size, radius, block }),
      className,
      isDisabled && "pointer-events-none opacity-50"
    );

    if (asChild) {
      return (
        <Slot
          ref={ref as any}
          className={classes}
          aria-disabled={isDisabled || undefined}
          aria-busy={isLoading || undefined}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    const iconSize = iconSizeByButton[size!];

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={isDisabled}
        className={classes}
        onClick={onClick}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading ? (
          <svg
            className={cn("animate-spin", iconSize)}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              opacity="0.25"
            />
            <path
              d="M22 12a10 10 0 0 1-10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <>
            {leftIcon && <span className={iconSize}>{leftIcon}</span>}
            <span className="truncate">{children}</span>
            {rightIcon && <span className={iconSize}>{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
