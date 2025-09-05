import { z } from "zod";

// Accepts a number or a string ("12,34" / "12.34"), validates the range and 2 decimal places
export const zMoney = z.preprocess(
  (v) => {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const s = v.replace(",", ".").trim();
      const n = Number(s);
      return Number.isFinite(n) ? n : s;
    }
    return v;
  },
  z
    .number()
    .min(0.01, "Minimum amount 0.01")
    .max(1_000_000, "Amount is too high")
    .refine(
      (n) => Number.isInteger(Math.round(n * 100)),
      "No more than 2 decimal places"
    )
);
