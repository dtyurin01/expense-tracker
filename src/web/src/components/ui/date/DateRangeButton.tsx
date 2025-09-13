"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker, type DateRange } from "react-day-picker";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { format, type Locale } from "date-fns";
import { de } from "date-fns/locale";

import { Button } from "@/components/ui/button/Button";
import { toLocalISO, fromLocalISO } from "@/lib/date-io";
import { PeriodSchema, type Period } from "@/schemas/period";
import type { DayPickerStyleProps } from "@/components/ui/date/datePicker.variants";
import { useDayPickerConfig } from "@/hooks/useDayPickerConfig";

type Props = {
  period?: Period;
  onChange?: (v: Period) => void;
  disabled?: boolean;
  min?: string;
  max?: string;
  label?: string;
  locale?: Locale;
  side?: Popover.PopoverContentProps["side"];
  align?: Popover.PopoverContentProps["align"];
  sideOffset?: number;
  ui?: Pick<DayPickerStyleProps, "size" | "radius" | "tone">;
} & Omit<
  React.ComponentProps<typeof Button>,
  "children" | "onChange" | "disabled"
>;

export function DateRangeButton({
  period,
  onChange,
  disabled,
  min,
  max,
  label = "Period",
  locale = de,
  side = "bottom",
  align = "start",
  sideOffset = 8,
  ui,
  ...buttonProps
}: Props) {
  const [open, setOpen] = React.useState(false);
  const { hiddenMatchers, classNames, formatters } = useDayPickerConfig({
    value: undefined,
    min,
    max,
    ui,
    locale,
  });

  const selected: DateRange | undefined = period
    ? {
        from: fromLocalISO(period.from),
        to: fromLocalISO(period.to),
      }
    : undefined;

  const labelText =
    period?.from && period?.to
      ? `${format(fromLocalISO(period.from)!, "dd MMM")} – ${format(
          fromLocalISO(period.to)!,
          "dd MMM"
        )}`
      : undefined;

  function handleRangeSelection(selected?: DateRange) {
    const period: Period = {
      from: selected?.from ? toLocalISO(selected.from) : undefined,
      to: selected?.to ? toLocalISO(selected.to) : undefined,
    };
    const parsed = PeriodSchema.safeParse(period);
    if (!parsed.success) {
      const issues = parsed.error.issues;
      const firstMessage =
        issues[0]?.message ?? issues.map((i) => i.message).join(", ");
      console.warn("Invalid period:", firstMessage, issues);
      return;
    }
    onChange?.(parsed.data);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          radius="lg"
          size={"sm"}
          aria-label={label}
          disabled={disabled}
          {...buttonProps}
        >
          <div className="flex items-center gap-2">
            <FiCalendar className="size-5" />
            {labelText && <span className="text-sm">{labelText}</span>}
          </div>
        </Button>
      </Popover.Trigger>

      <Popover.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50 rounded-2xl border border-border bg-surface p-2"
      >
        <DayPicker
          mode="range"
          selected={selected}
          onSelect={handleRangeSelection}
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
