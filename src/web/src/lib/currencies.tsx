import {
  TbCurrencyDollar,
  TbCurrencyEuro,
  TbCurrencyPound,
  TbCurrencyHryvnia,
} from "react-icons/tb";

export type CurrencyCode = "usd" | "eur" | "gbp" | "uah";

export const currencies: Record<
  CurrencyCode,
  { label: string; icon: React.ReactNode }
> = {
  usd: { label: "USD", icon: <TbCurrencyDollar className="size-4" /> },
  eur: { label: "EUR", icon: <TbCurrencyEuro className="size-4" /> },
  gbp: { label: "GBP", icon: <TbCurrencyPound className="size-4" /> },
  uah: { label: "UAH", icon: <TbCurrencyHryvnia className="size-4" /> },
};

export const currencyList = Object.entries(currencies).map(([code, cfg]) => ({
  value: code as CurrencyCode,
  ...cfg,
}));

