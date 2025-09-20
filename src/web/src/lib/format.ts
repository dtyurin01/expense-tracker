import { CurrencyCode, currencyList } from "./currencies";

export function getCurrency(curr: CurrencyCode) {
  return currencyList.find((c) => c.value === curr);
}

export function formatMoney(value: number, curr: CurrencyCode) {
  const cfg = getCurrency(curr);
  if (!cfg) {
    throw new Error(`Unknown currency: ${curr}`);
  }
  const { label } = cfg;

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: label,
    maximumFractionDigits: 2,
  }).format(value);
}

export function monthLabel(yyyyMM: string) {
  const [yyyy, mm] = yyyyMM.split("-");

  const date = new Date(Number(yyyy), Number(mm) - 1, 1);
  const label = date.toLocaleString(undefined, { month: "short" });

  return label;
}

export function dayMonthYearLabel(ddyyyyMM: string) {
  const [dd, yyyy, mm] = ddyyyyMM.split("-");

  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  const label = date.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return label;
}
