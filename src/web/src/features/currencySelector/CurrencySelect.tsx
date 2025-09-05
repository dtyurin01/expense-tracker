"use client";

import * as React from "react";
import {
  Select,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select/Select";
import {
  TbCurrencyDollar,
  TbCurrencyEuro,
  TbCurrencyPound,
  TbCurrencyHryvnia,
} from "react-icons/tb";

type Props = {
  value: string;
  onChange: (v: string) => void;
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
  const icons: Record<string, React.ReactNode> = {
    usd: <TbCurrencyDollar className="size-4" />,
    eur: <TbCurrencyEuro className="size-4" />,
    gbp: <TbCurrencyPound className="size-4" />,
    uah: <TbCurrencyHryvnia className="size-4" />,
  };

  return (
    <Select
      value={value}
      onValueChange={onChange}
      variant={variant}
      size={size}
      radius={radius}
      block={block}
      disabled={disabled}
      placeholder="Select…"
      leftSlot={icons[value]}
      className={className}
    >
      <SelectItem
        value="usd"
        leftIcon={<TbCurrencyDollar className="size-4" />}
      >
        USD
      </SelectItem>
      <SelectItem value="eur" leftIcon={<TbCurrencyEuro className="size-4" />}>
        EUR
      </SelectItem>
      <SelectItem value="gbp" leftIcon={<TbCurrencyPound className="size-4" />}>
        GBP
      </SelectItem>

      <SelectSeparator />

      <SelectItem
        value="uah"
        leftIcon={<TbCurrencyHryvnia className="size-4" />}
      >
        UAH
      </SelectItem>
    </Select>
  );
}
