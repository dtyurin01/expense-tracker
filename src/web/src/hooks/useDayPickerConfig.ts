import * as React from "react";
import type { Matcher } from "react-day-picker";
import { format, type Locale } from "date-fns";
import { fromLocalISO } from "@/lib/date-io";
import {
  makeDayPickerClassNames,
  type DayPickerStyleProps,
} from "@/components/ui/date/datePicker.variants";

type Params = {
  value?: string;
  min?: string;
  max?: string;
  ui?: Pick<DayPickerStyleProps, "size" | "radius" | "tone">;
  locale: Locale;
};

export function useDayPickerConfig({ value, min, max, ui, locale }: Params) {
  const selected = fromLocalISO(value);
  const fromDate = fromLocalISO(min);
  const toDate = fromLocalISO(max);

  const hiddenMatchers = React.useMemo<Matcher[]>(() => {
    const arr: Matcher[] = [];
    if (fromDate) arr.push({ before: fromDate });
    if (toDate) arr.push({ after: toDate });
    return arr;
  }, [fromDate, toDate]);

  const classNames = React.useMemo(() => makeDayPickerClassNames(ui), [ui]);

  const formatters = React.useMemo(
    () => ({
      formatCaption: (d: Date) => format(d, "LLLL yyyy", { locale }),
      formatWeekdayName: (d: Date) => format(d, "EEEEE", { locale }),
    }),
    [locale]
  );

  return { selected, fromDate, toDate, hiddenMatchers, classNames, formatters };
}
