"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";

import { FiCalendar } from "react-icons/fi";
import { Locale } from "date-fns";
import { de } from "date-fns/locale";

import { Input } from "@/components/ui/input/Input";
import { toLocalISO } from "@/lib/date-io";
import { type DayPickerStyleProps } from "@/components/ui/date/datePicker.variants";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useDayPickerConfig } from "@/hooks/useDayPickerConfig";

type Props = {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  label?: string;
  locale?: Locale;
  side?: Popover.PopoverContentProps["side"];
  align?: Popover.PopoverContentProps["align"];
  sideOffset?: number;

  ui?: Pick<DayPickerStyleProps, "size" | "radius" | "tone">;

  className?: string;
};

export function DatePicker({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  disabled,
  min,
  max,
  ui,
  label,
  locale = de,
  side = "bottom",
  align = "start",
  sideOffset = 8,
  className,
}: Props) {
  const { selected, hiddenMatchers, classNames, formatters } =
    useDayPickerConfig({
      value,
      min,
      max,
      ui,
      locale,
    });

  return (
    <Popover.Root>
      <div className="relative">
        <Input
          label={label ?? "Date"}
          hint="You can pick dates from 2020/01/01 till today"
          block
          readOnly
          disabled={disabled}
          value={value ?? ""}
          placeholder={placeholder}
          className={`pr-10 ${className ?? ""}`}
          rightIcon={<FiCalendar aria-hidden />}
          onClick={(e) => (e.currentTarget as HTMLInputElement).blur()}
        />

        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label={label ?? "Open date picker"}
            disabled={disabled}
            className={`absolute inset-0 z-10 bg-transparent cursor-pointer`}
          />
        </Popover.Trigger>
      </div>
      <Popover.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50 rounded-2xl border border-border bg-surface p-2 shadow-xl"
      >
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(d) => d && onChange?.(toLocalISO(d))}
          hidden={hiddenMatchers}
          locale={locale}
          classNames={classNames}
          formatters={formatters}
          components={{
            Chevron: ({ orientation }) =>
              orientation === "left" ? (
                <FiChevronLeft className="size-4 text-muted-foreground group-hover:text-foreground" />
              ) : (
                <FiChevronRight className="size-4 text-muted-foreground group-hover:text-foreground" />
              ),
          }}
        />
      </Popover.Content>
    </Popover.Root>
  );
}
