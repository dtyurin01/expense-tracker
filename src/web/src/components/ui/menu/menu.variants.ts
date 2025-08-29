import { cva, type VariantProps } from "class-variance-authority";

export const menuContent = cva(
  "min-w-40 p-1 bg-surface border border-border shadow-lg will-change-transform",
  {
    variants: {
      elevation: { 0: "shadow-none", 1: "shadow-md", 2: "shadow-lg" },
      radius: { sm: "rounded-md", md: "rounded-lg", lg: "rounded-xl" },
    },
    defaultVariants: { elevation: 2, radius: "md" },
  }
);

export const menuItem = cva(
  "flex select-none items-center gap-2 rounded-md px-2 text-sm outline-none " +
    "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none " +
    "data-[highlighted]:bg-surface/80",
  {
    variants: {
      density: { compact: "h-7", comfy: "h-9" },
      tone: {
        default:
          "data-[highlighted]:bg-brand-300/20 data-[highlighted]:text-foreground",
        danger:
          "text-error data-[highlighted]:bg-error/15 data-[highlighted]:text-error",
      },
    },
    defaultVariants: { density: "comfy", tone: "default" },
  }
);

export const menuLabel = cva("px-2 py-1 text-[12px] text-muted-foreground");

export const shortcutText = cva(
  "ml-auto text-[11px] tracking-wide text-muted-foreground"
);

export type MenuContentVariants = VariantProps<typeof menuContent>;
export type MenuItemVariants = VariantProps<typeof menuItem>;
