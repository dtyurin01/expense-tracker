"use client";

import * as React from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { cn } from "@/lib/cn";
import {
  selectTriggerVariants,
  type SelectVariantProps,
  iconSizeBySelect,
} from "./select.variants";

export type SelectProps = {
  className?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  leftSlot?: React.ReactNode;
} & SelectVariantProps &
  Omit<React.ComponentPropsWithRef<typeof RadixSelect.Root>, "onValueChange">;

const contentRadiusByTrigger = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
} as const;

export function Select({
  className,
  variant,
  size,
  radius,
  block,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  disabled,
  leftSlot,
  children,
  ...rootProps
}: SelectProps) {
  const chevronSize = iconSizeBySelect[size ?? "md"];

  return (
    <RadixSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      {...rootProps}
    >
      <RadixSelect.Trigger
        disabled={disabled}
        className={cn(
          selectTriggerVariants({ variant, size, radius, block }),
          className
        )}
      >
        <div className="flex min-w-0 items-center gap-2 cursor-pointer">
          {leftSlot && (
            <span
              aria-hidden
              className={cn(
                "shrink-0 grid place-items-center text-current leading-none",
                chevronSize
              )}
            >
              {leftSlot}
            </span>
          )}
          <RadixSelect.Value placeholder={placeholder} />
        </div>
        <RadixSelect.Icon aria-hidden>
          <FiChevronDown className={chevronSize} />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          className={cn(
            "z-80 overflow-hidden border border-border bg-surface text-foreground shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            contentRadiusByTrigger[radius ?? "lg"],
            "w-[var(--radix-select-trigger-width)] max-w-[95vw]"
          )}
          position="popper"
          sideOffset={8}
        >
          <RadixSelect.Viewport className="p-1">
            {children}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
type ItemProps = React.ComponentPropsWithoutRef<typeof RadixSelect.Item> & {
  leftIcon?: React.ReactNode;
};

export function SelectItem({
  className,
  children,
  leftIcon,
  ...props
}: ItemProps) {
  return (
    <RadixSelect.Item
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none",
        "data-[highlighted]:bg-brand/10 data-[highlighted]:text-foreground",
        "data-[disabled]:opacity-50 cursor-pointer",
        className
      )}
      {...props}
    >
      {leftIcon && (
        <span aria-hidden className="size-4">
          {leftIcon}
        </span>
      )}
      <RadixSelect.ItemText className="truncate">
        {children}
      </RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="ml-auto">
        <FiCheck className="size-4" />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
}
export const SelectSeparator = () => (
  <RadixSelect.Separator className="my-1 h-px bg-border" />
);
