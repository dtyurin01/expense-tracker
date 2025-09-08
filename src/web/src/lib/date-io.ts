import { format, parse, isValid } from "date-fns";

// String "YYYY-MM-DD" from Date
export const toLocalISO = (d: Date) => format(d, "yyyy-MM-dd");

// Date from "YYYY-MM-DD"
export const fromLocalISO = (s?: string) =>
  s ? parse(s, "yyyy-MM-dd", new Date()) : undefined;

// Validation
export const isISODateString = (s: string) => {
  const d = parse(s, "yyyy-MM-dd", new Date());
  return isValid(d) && format(d, "yyyy-MM-dd") === s;
};
