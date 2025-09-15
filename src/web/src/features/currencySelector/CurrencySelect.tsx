"use client";

import * as React from "react";
import {
  Select,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select/Select";
import { currencies, currencyList, type CurrencyCode } from "@/lib/currencies";

type Props = {
  value: CurrencyCode;
  onChange: (v: CurrencyCode) => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "icon";
  radius?: "sm" | "md" | "lg" | "full";
  block?: boolean;
  disabled?: boolean;
  className?: string;
};

export function CurrencySelect({
  value,
  onChange,
  variant = "secondary",
  size = "md",
  radius = "lg",
  block = false,
  disabled,
  className,
}: Props) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as CurrencyCode)}
      variant={variant}
      size={size}
      radius={radius}
      block={block}
      disabled={disabled}
      placeholder="Select…"
      leftSlot={currencies[value]?.icon}
      className={className}
    >
      {currencyList.map((c, i) => (
        <React.Fragment key={c.value}>
          <SelectItem value={c.value} leftIcon={c.icon}>
            {c.label}
          </SelectItem>
          {i === 2 && <SelectSeparator />}
        </React.Fragment>
      ))}
    </Select>
  );
}
