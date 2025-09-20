"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FiFilter } from "react-icons/fi";
import { Button, type ButtonProps } from "@/components/ui/button/Button";
import { cn } from "@/lib/cn";
import { TxFilter, LABEL } from "@/types/transactionFilter";

type Props = {
  value?: TxFilter; // controlled
  defaultValue?: TxFilter; // uncontrolled
  onChange?: (f: TxFilter) => void;

  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  radius?: ButtonProps["radius"];
  className?: string;

  side?: DropdownMenu.DropdownMenuContentProps["side"];
  align?: DropdownMenu.DropdownMenuContentProps["align"];
  sideOffset?: number;

  showCurrent?: boolean; // default: true
};

export function TxFilterButton({
  value,
  defaultValue = "all",
  onChange,
  variant = "secondary",
  size = "sm",
  radius = "lg",
  className,
  side = "bottom",
  align = "end",
  sideOffset = 8,
  showCurrent = true,
}: Props) {
  // controlled/uncontrolled
  const [inner, setInner] = React.useState<TxFilter>(defaultValue);
  const effective = value ?? inner;

  const setFilter = (f: TxFilter) => {
    if (value === undefined) setInner(f);
    onChange?.(f);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant={variant}
          size={size}
          radius={radius}
          className={cn(
            "gap-2 cursor-pointer hover:bg-foreground/2 active:bg-foreground/2",
            className
          )}
          rightIcon={<FiFilter size={16} />}
        >
          {showCurrent ? `Filter: ${LABEL[effective]}` : "Filter"}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className="z-50 min-w-[180px] rounded-lg border border-border bg-surface p-1 shadow-lg"
        >
          {(["all", "income", "expense"] as const).map((f) => (
            <DropdownMenu.Item
              key={f}
              onSelect={() => setFilter(f)}
              className={cn(
                "cursor-pointer select-none rounded-md px-3 py-2 text-sm outline-none",
                "hover:bg-brand/10",
                effective === f && "bg-brand/10"
              )}
            >
              {LABEL[f]}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
