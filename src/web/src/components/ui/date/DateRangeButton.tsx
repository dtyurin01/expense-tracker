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
import { isSameRange } from "@/lib/dateObjCompare";

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
  sideOffset = 8,
  ui,
  ...buttonProps
}: Props) {
  const [open, setOpen] = React.useState(false);

  const initialRange: DateRange | undefined = React.useMemo(
    () =>
      period
        ? {
            from: fromLocalISO(period.from),
            to: fromLocalISO(period.to),
          }
        : undefined,
    [period]
  );

  const [draft, setDraft] = React.useState<DateRange | undefined>(initialRange);

  React.useEffect(() => {
    if (open) setDraft(initialRange);
  }, [initialRange, open]);

  const { hiddenMatchers, classNames, formatters } = useDayPickerConfig({
    value: undefined,
    min,
    max,
    ui,
    locale,
  });

  const extendedClassNames = {
    ...classNames,
    nav: "flex items-center justify-between w-full px-2 cursor-pointer",
    nav_button_previous: "absolute mb-2",
    nav_button_next: "absolute",
    caption_label: "flex-1 text-center",
  };

  const labelText =
    period?.from && period?.to
      ? `${format(fromLocalISO(period.from)!, "dd MMM")} – ${format(
          fromLocalISO(period.to)!,
          "dd MMM"
        )}`
      : undefined;

  function asPeriod(range?: DateRange): Period {
    return {
      from: range?.from ? toLocalISO(range.from) : undefined,
      to: range?.to ? toLocalISO(range.to) : undefined,
    };
  }

  // TODO: Move handle save to parent component

  function handleSave() {
    const parsed = PeriodSchema.safeParse(asPeriod(draft));
    if (!parsed.success) {
      const issues = parsed.error.issues;
      console.warn("Invalid period:", issues);
      return;
    }
    onChange?.(parsed.data);
    setOpen(false);
  }

  function handleReset() {
    setDraft(undefined);
  }

  const isDraftComplete = !!(draft?.from && draft?.to);
  const isDirty = !isSameRange(draft, initialRange);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          radius="lg"
          size={"sm"}
          aria-label={label}
          disabled={disabled}
          className="hover:bg-foreground/2 active:bg-foreground/2"
          {...buttonProps}
        >
          <div className="flex items-center gap-2">
            <FiCalendar className="size-5" />
            {labelText && <span className="text-sm">{labelText}</span>}
          </div>
        </Button>
      </Popover.Trigger>

      <Popover.Content
        side="bottom"
        align="end"
        sideOffset={sideOffset}
        className="z-50 rounded-2xl border border-border bg-surface p-2"
      >
        <DayPicker
          mode="range"
          selected={draft}
          onSelect={setDraft}
          hidden={hiddenMatchers}
          locale={locale}
          classNames={extendedClassNames}
          formatters={formatters}
          components={{
            Chevron: ({ orientation }) =>
              orientation === "left" ? (
                <FiChevronLeft className="size-5 rounded-lg text-muted-foreground hover:bg-foreground/2 active:bg-foreground/2 " />
              ) : (
                <FiChevronRight className="size-5 rounded-lg text-muted-foreground hover:bg-foreground/2 active:bg-foreground/2" />
              ),
          }}
        />

        <div className="mt-2 flex items-center justify-end gap-2 px-2">
          <Button
            variant="ghost"
            size="sm"
            radius="lg"
            onClick={handleReset}
            disabled={!draft?.from && !draft?.to}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            radius="lg"
            onClick={handleSave}
            disabled={!isDraftComplete || !isDirty}
          >
            Save
          </Button>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
