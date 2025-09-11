import { cva, type VariantProps } from "class-variance-authority";

export const cardVariants = cva(
  "relative rounded-2xl border border-border bg-surface text-foreground " +
    "transition-colors",
  {
    variants: {
      elevation: {
        0: "shadow-none",
        1: "shadow-sm",
        2: "shadow-md",
        3: "shadow-lg",
      },
      divided: { true: "divide-y divide-border/70", false: "" },
      interactive: {
        true: "hover:bg-surface/90 focus-within:ring-2 focus-within:ring-brand/50",
        false: "",
      },
    },
    defaultVariants: { elevation: 1, divided: true, interactive: false },
  }
);
export type CardVariantProps = VariantProps<typeof cardVariants>;
