import { cn } from "@/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";

const sizeV = {
  sm: "w-8 h-8",
  md: "w-9 h-9",
  lg: "w-10 h-10",
} as const;

const radiusV = {
  sm: "rounded-md",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-full",
} as const;

const toneMap = {
  brand: {
    daySelected: "bg-brand text-brand-foreground hover:bg-brand focus:bg-brand",
    ring: "ring-brand",
    softBg: "bg-brand/10",
  },
  success: {
    daySelected:
      "bg-success text-success-foreground hover:bg-success focus:bg-success",
    ring: "ring-success",
    softBg: "bg-success/10",
  },
  warning: {
    daySelected:
      "bg-warning text-warning-foreground hover:bg-warning focus:bg-warning",
    ring: "ring-warning",
    softBg: "bg-warning/10",
  },
  info: {
    daySelected: "bg-info text-info-foreground hover:bg-info focus:bg-info",
    ring: "ring-info",
    softBg: "bg-info/10",
  },
  destructive: {
    daySelected:
      "bg-destructive text-destructive-foreground hover:bg-destructive focus:bg-destructive",
    ring: "ring-destructive",
    softBg: "bg-destructive/10",
  },
} as const;

export const dpRoot = cva("p-2");
export const dpCaption = cva("px-2 py-1 text-sm font-medium");
export const dpNav = cva("flex items-center gap-1");
export const dpNavButton = cva("border border-border hover:bg-surface-2", {
  variants: {
    size: { sm: "h-7 w-7", md: "h-8 w-8", lg: "h-9 w-9" },
    radius: radiusV,
  },
  defaultVariants: { size: "md", radius: "lg" },
});
export const dpHeadRow = cva("mb-1 grid grid-cols-7");
export const dpHeadCell = cva("text-xs text-muted-foreground text-center", {
  variants: {
    size: { sm: "w-8", md: "w-9", lg: "w-10" },
  },
  defaultVariants: { size: "md" },
});
export const dpRow = cva("mt-1 grid grid-cols-7");
export const dpCell = cva("", {
  variants: { size: sizeV },
  defaultVariants: { size: "md" },
});

export const dpDay = cva(
  "grid place-items-center hover:bg-brand/10 focus:outline-none",
  {
    variants: {
      size: sizeV,
      radius: radiusV,
    },
    defaultVariants: { size: "md", radius: "lg" },
  }
);

export const dpDaySelected = cva("", {
  variants: {
    tone: {
      brand: toneMap.brand.daySelected,
      success: toneMap.success.daySelected,
      warning: toneMap.warning.daySelected,
      info: toneMap.info.daySelected,
      destructive: toneMap.destructive.daySelected,
    },
  },
  defaultVariants: { tone: "brand" },
});

export const dpDayRangeMiddle = cva(
  "ring-1 !bg-transparent hover:!bg-transparent text-foreground focus:!bg-transparent",
  {
    variants: {
      tone: {
        brand: toneMap.brand.ring,
        success: toneMap.success.ring,
        warning: toneMap.warning.ring,
        info: toneMap.info.ring,
        destructive: toneMap.destructive.ring,
      },
    },
    defaultVariants: { tone: "brand" },
  }
);


export const dpDayToday = cva("ring-1", {
  variants: {
    tone: {
      brand: toneMap.brand.ring,
      success: toneMap.success.ring,
      warning: toneMap.warning.ring,
      info: toneMap.info.ring,
      destructive: toneMap.destructive.ring,
    },
  },
  defaultVariants: { tone: "brand" },
});

export const dpDayOutside = cva("text-muted-foreground/50");
export const dpDayDisabled = cva("opacity-40 cursor-not-allowed");

export type DayPickerStyleProps = VariantProps<typeof dpDay> &
  VariantProps<typeof dpNavButton> &
  VariantProps<typeof dpDaySelected> & {
    /** tone */
    tone?: NonNullable<VariantProps<typeof dpDaySelected>["tone"]>;
  };

/** Obj gen for DayPicker.classNames */
export const makeDayPickerClassNames = (opts?: DayPickerStyleProps) => {
  const size = opts?.size ?? "md";
  const radius = opts?.radius ?? "lg";
  const tone = opts?.tone ?? "brand";

  return {
    root: dpRoot(),
    month_caption: dpCaption(),
    button_previous: cn(
      dpNavButton({ size, radius }),
      "inline-flex items-center justify-center h-7 w-7 rounded-xl border border-border hover:bg-surface-2"
    ),
    button_next: cn(
      dpNavButton({ size, radius }),
      "inline-flex items-center justify-center h-7 w-7 ml-2 rounded-xl border border-border hover:bg-surface-2"
    ),
    head_row: dpHeadRow(),
    weekdays: dpHeadRow(),
    weekday: dpHeadCell({ size }),
    week: dpRow(),
    day: cn(dpCell({ size }), "rounded-xl"),
    day_button: dpDay({ size, radius }),
    selected: dpDaySelected({ tone }),
    today: dpDayToday({ tone }),
    outside: dpDayOutside(),
    disabled: dpDayDisabled(),

    // Range selection (react-day-picker mode="range")
    range_start: cn(
      dpDaySelected({ tone }),
      "relative after:content-[''] after:absolute after:bottom-1 after:left-1 after:h-1 after:w-1 after:rounded-full after:bg-current"
    ),
    range_end: cn(
      dpDaySelected({ tone }),
      "relative after:content-[''] after:absolute after:bottom-1 after:right-1 after:h-1 after:w-1 after:rounded-full after:bg-current"
    ),
    range_middle: dpDayRangeMiddle({ tone }),
  } as const;
};
