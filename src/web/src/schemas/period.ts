import { z } from "zod";
import { parseISO } from "date-fns";
import { zIsoDate } from "./common";

export const PeriodSchema = z
  .object({
    from: zIsoDate.optional(),
    to: zIsoDate.optional(),
  })
  .refine(
    (p) => {
      if (!p.from || !p.to) return true;
      return parseISO(p.from) <= parseISO(p.to);
    },
    { message: "'from' must be before or equal to 'to'", path: ["to"] }
  );

export type Period = z.infer<typeof PeriodSchema>;
