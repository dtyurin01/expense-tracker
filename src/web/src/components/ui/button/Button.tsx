"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";
import {
  buttonVariants,
  type ButtonVariantProps,
  iconSizeByButton,
} from "./button.variants";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantProps & {
    asChild?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      radius,
      block,
      asChild,
      isLoading,
      disabled,
      leftIcon,
      rightIcon,
      children,
      type = "button",
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const iconSize = iconSizeByButton[size ?? "md"];
    const isDisabled = disabled || isLoading;

    function handleClick(e: React.MouseEvent) {
      if (isDisabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick?.(e as React.MouseEvent<HTMLButtonElement, MouseEvent>);
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, radius, block }),
          className,
          isDisabled && "pointer-events-none opacity-50"
        )}
        {...(!asChild
          ? { type, disabled: isDisabled }
          : { "aria-disabled": isDisabled, onClick: handleClick })}
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
      </Comp>
    );
  }
);

Button.displayName = "Button";
