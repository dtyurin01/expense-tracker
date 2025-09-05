import { cva, type VariantProps } from "class-variance-authority";

export const selectTriggerVariants = cva(
  "inline-flex items-center justify-between gap-2 whitespace-nowrap transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "leading-none hover:bg-foreground/10 hover:border-border/80",
  {
    variants: {
      variant: {
        primary: "bg-brand text-brand-foreground hover:bg-brand-600 rounded-xl",
        secondary:
          "bg-surface text-foreground border border-border hover:bg-surface/80 rounded-xl",
        outline:
          "bg-transparent text-foreground border border-border hover:bg-surface rounded-xl",
        ghost: "bg-transparent text-foreground hover:bg-surface rounded-xl",
      },
      size: {
        xs: "h-7  px-2  text-xs",
        sm: "h-8  px-3  text-sm",
        md: "h-10 px-4  text-sm",
        lg: "h-12 px-6  text-base",
        xl: "h-14 px-8  text-lg",
        icon: "h-10 w-10 p-0",
      },
      radius: {
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-full",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
      radius: "lg",
      block: false,
    },
  }
);

export const iconSizeBySelect = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-5",
  lg: "size-5",
  xl: "size-6",
  icon: "size-5",
} as const;

export type SelectVariantProps = VariantProps<typeof selectTriggerVariants>;
