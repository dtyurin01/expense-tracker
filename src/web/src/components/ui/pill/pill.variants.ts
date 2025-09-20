import { cva } from "class-variance-authority";

export const pillVariants = cva(
  "inline-flex items-center rounded-lg font-medium",
  {
    variants: {
      size: {
        xs: "px-1.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-sm",
        md: "px-2.5 py-0.5 text-sm",  // default (default)
        lg: "px-3 py-1 text-base",
        xl: "px-4 py-1.5 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);