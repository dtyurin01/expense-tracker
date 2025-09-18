import { DateRange } from "react-day-picker";

export const startOfDayTs = (d?: Date) =>
  d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() : NaN;

export function isSameRange(a?: DateRange, b?: DateRange) {
  if (!a?.from && !a?.to && !b?.from && !b?.to) return true;

  const af = startOfDayTs(a?.from);
  const at = startOfDayTs(a?.to);
  const bf = startOfDayTs(b?.from);
  const bt = startOfDayTs(b?.to);

  return af === bf && at === bt;
}
