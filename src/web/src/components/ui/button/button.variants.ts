import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 " +
    "disabled:pointer-events-none disabled:opacity-50 rounded-xl",
  {
    variants: {
      variant: {
        primary: "bg-brand text-brand-foreground hover:bg-brand-600",
        secondary:
          "bg-surface text-foreground border border-border hover:bg-surface/80",
        outline:
          "bg-transparent text-foreground border border-border hover:bg-surface",
        ghost: "bg-transparent text-foreground hover:bg-surface",
        link: "bg-transparent text-brand underline underline-offset-4 hover:text-brand-600",
        destructive: "bg-error text-white hover:bg-error/90",
        success: "bg-success text-white hover:bg-success/90",
        warning: "bg-warning text-black hover:bg-warning/90",
        info: "bg-info text-white hover:bg-info/90",

        iconDark: "bg-icon-dark text-icon-fore hover:bg-icon-dark/90",
        iconTransparent:
          "bg-transparent text-foreground border border-border " +
          "hover:bg-surface hover:border-border/80 " + 
          "active:bg-foreground/15",
      },
      size: {
        xs: "h-7  px-2  text-xs",
        sm: "h-9    px-3  text-sm",
        md: "h-10 px-3  text-sm",
        lg: "h-12 px-6  text-base",
        xl: "h-14 px-8  text-lg",
        icon: "h-11 w-11 p-0",
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
      variant: "primary",
      size: "md",
      radius: "lg",
      block: false,
    },
  }
);

export const iconSizeByButton = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-5",
  lg: "size-5",
  xl: "size-6",
  icon: "size-5",
} as const;

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
