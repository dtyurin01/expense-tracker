"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Locale } from "date-fns";
import { de } from "date-fns/locale";

import { Button, type ButtonProps } from "@/components/ui/button/Button";
import { toLocalISO } from "@/lib/date-io";
import { type DayPickerStyleProps } from "@/components/ui/date/datePicker.variants";
import { useDayPickerConfig } from "@/hooks/useDayPickerConfig";

type Props = {
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  min?: string;
  max?: string;
  label?: string;
  locale?: Locale;
  side?: Popover.PopoverContentProps["side"];
  align?: Popover.PopoverContentProps["align"];
  sideOffset?: number;

  ui?: Pick<DayPickerStyleProps, "size" | "radius" | "tone">;
} & Omit<ButtonProps, "onChange" | "disabled" | "children">;

export function DateButton({
  value,
  onChange,
  disabled,
  min,
  max,
  label,
  locale = de,
  side = "bottom",
  align = "start",
  sideOffset = 8,
  ui,
  ...buttonProps
}: Props) {
  const [open, setOpen] = React.useState(false);
  const { selected, hiddenMatchers, classNames, formatters } =
    useDayPickerConfig({
      value,
      min,
      max,
      ui,
      locale,
    });

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          type="button"
          aria-label={label}
          disabled={disabled}
          variant="outline"
          size="icon"
          radius="lg"
          {...buttonProps}
        >
          <FiCalendar className="size-5" />
        </Button>
      </Popover.Trigger>

      <Popover.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50 rounded-2xl border border-border bg-surface p-2 shadow-xl"
      >
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(d) => {
            if (d) onChange?.(toLocalISO(d));
            setOpen(false);
          }}
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
