import { cva, type VariantProps } from "class-variance-authority";

export const inputWrapper = cva(
  "relative inline-flex items-center transition-colors disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      block: { true: "w-full", false: "" },
      radius: {
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-full",
      },
      status: {
        default: "",
        success: "data-[status=success]",
        warning: "data-[status=warning]",
        error: "data-[status=error]",
        info: "data-[status=info]",
      },
    },
    defaultVariants: { block: false, radius: "lg", status: "default" },
  }
);

export const inputField = cva(
  // base
  "bg-surface !text-foreground placeholder:text-muted-foreground/70 " +
    "border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 " +
    "transition-colors [&::-ms-reveal]:hidden " + // hide eye on Edge password
    "disabled:bg-surface disabled:opacity-70",
    
  {
    variants: {
      size: {
        xs: "h-8 px-3 text-sm",
        sm: "h-9 px-3.5 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-11 px-4.5 text-base",
      },
      radius: {
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-full",
      },
      withLeft: { true: "pl-10", false: "" },
      withRight: { true: "pr-10", false: "" },
      block: { true: "w-full", false: "" },
      status: {
        default: "",
        success: "data-[status=success]:border-success/70",
        warning: "data-[status=warning]:border-warning/70",
        error: "data-[status=error]:border-error/70",
        info: "data-[status=info]:border-info/70",
      },
    },
    defaultVariants: {
      size: "md",
      radius: "lg",
      block: false,
      withLeft: false,
      withRight: false,
      status: "default",
    },
    compoundVariants: [
      { status: "success", class: "focus-visible:ring-success/40" },
      { status: "warning", class: "focus-visible:ring-warning/40" },
      { status: "error", class: "focus-visible:ring-error/40" },
      { status: "info", class: "focus-visible:ring-info/40" },
    ],
  }
);

export const adornment = cva(
  "absolute inset-y-0 flex items-center text-muted-foreground z-10",
  {
    variants: {
      side: {
        left: "left-3",
        right: "right-3",
      },
      size: {
        xs: "text-[14px]",
        sm: "text-[16px]",
        md: "text-[18px]",
        lg: "text-[18px]",
      },
    },
    defaultVariants: { side: "left", size: "md" },
  }
);

export const splitContainer = cva(
  "flex items-stretch overflow-hidden bg-surface " +
    "border border-border transition-colors " +
    "focus-within:ring-2 focus-within:ring-brand/50 focus-within:ring-inset",
  {
    variants: {
      size: {
        xs: "h-8 text-sm",
        sm: "h-9 text-sm",
        md: "h-10 text-base",
        lg: "h-11 text-base",
      },
      radius: {
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
      },
      block: { true: "w-full", false: "" },
      status: {
        default: "",
        success: "data-[status=success]:border-success/70",
        warning: "data-[status=warning]:border-warning/70",
        error: "data-[status=error]:border-error/70",
        info: "data-[status=info]:border-info/70",
      },
    },
    defaultVariants: {
      size: "md",
      radius: "lg",
      block: false,
      status: "default",
    },
  }
);

export const splitInput = cva(
  "flex-1 bg-transparent px-3 overflow-hidden placeholder:text-muted-foreground/70",
  {
    variants: {
      size: {
        xs: "text-sm",
        sm: "text-sm",
        md: "text-base",
        lg: "text-base",
      },
    },
    defaultVariants: { size: "md" },
  }
);

export const splitRight = cva(
  "border-l border-border px-3 " +
    "flex items-center justify-center text-foreground/80"
);

export type InputVariants = VariantProps<typeof inputField> &
  VariantProps<typeof inputWrapper>;
export type SplitVariants = VariantProps<typeof splitContainer>;
