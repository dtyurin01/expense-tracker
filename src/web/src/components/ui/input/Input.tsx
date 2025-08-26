"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import {
  inputWrapper,
  inputField,
  adornment,
  splitContainer,
  splitInput,
  splitRight,
  type InputVariants,
  type SplitVariants,
} from "./input.variants";

export type BaseInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "color"
> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  status?: NonNullable<InputVariants["status"]>;
  size?: NonNullable<InputVariants["size"]>;
  radius?: NonNullable<InputVariants["radius"]>;
  block?: boolean;
  label?: string;
  hint?: string;
  errorText?: string;
};

export const Input = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      className,
      leftIcon,
      rightIcon,
      status = "default",
      size = "md",
      radius = "lg",
      block,
      label,
      hint,
      errorText,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const fieldId = id || generatedId;
    const hintId = hint ? `${fieldId}-hint` : undefined;
    const errorId = errorText ? `${fieldId}-error` : undefined;

    return (
      <div className={cn(block && "w-full")}>
        {label && (
          <label
            htmlFor={fieldId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}

        <div
          className={cn(inputWrapper({ block, radius }))}
          data-status={status}
        >
          {leftIcon && (
            <span className={cn(adornment({ side: "left", size }))}>
              {leftIcon}
            </span>
          )}

          <input
            id={fieldId}
            ref={ref}
            className={cn(
              inputField({
                size,
                radius,
                block,
                status,
                withLeft: !!leftIcon,
                withRight: !!rightIcon,
              }),
              className
            )}
            aria-invalid={status === "error" ? true : undefined}
            aria-describedby={cn(hintId, errorId)}
            {...props}
          />

          {rightIcon && (
            <span className={cn(adornment({ side: "right", size }))}>
              {rightIcon}
            </span>
          )}
        </div>

        {hint && (
          <p id={hintId} className="mt-1 text-xs text-muted-foreground">
            {hint}
          </p>
        )}
        {status === "error" && errorText && (
          <p id={errorId} className="mt-1 text-xs text-error">
            {errorText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export type InputSplitProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  rightSlot: React.ReactNode;
  size?: NonNullable<SplitVariants["size"]>;
  radius?: NonNullable<SplitVariants["radius"]>;
  block?: boolean;
  status?: NonNullable<SplitVariants["status"]>;
  label?: string;
};

export const InputSplit = React.forwardRef<HTMLInputElement, InputSplitProps>(
  (
    {
      className,
      rightSlot,
      size = "md",
      radius = "lg",
      block,
      status = "default",
      label,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const fieldId = id || generatedId;

    return (
      <div className={cn(block && "w-full", className)}>
        {label && (
          <label
            htmlFor={fieldId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}

        <div
          className={cn(splitContainer({ size, radius, block }))}
          data-status={status}
        >
          <input
            id={fieldId}
            ref={ref}
            className={cn(splitInput({ size }), "min-w-0")}
            {...props}
          />
          <div className={cn(splitRight(), "min-w-[84px]")}>{rightSlot}</div>
        </div>
      </div>
    );
  }
);

InputSplit.displayName = "InputSplit";
