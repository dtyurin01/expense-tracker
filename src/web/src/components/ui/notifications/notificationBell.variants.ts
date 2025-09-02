import { cva, type VariantProps } from "class-variance-authority";

export const bellTrigger = cva(
  "relative inline-flex items-center justify-center rounded-full " +
    "hover:bg-foreground/10 hover:border-border/80 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
  {
    variants: {
      size: {
        md: "h-9  w-9  p-2",
        lg: "h-11 w-11 p-0",
      },
      tone: {
        ghost: "",
        surface: "bg-surface border border-border hover:bg-surface/80",
      },
    },
    defaultVariants: { size: "lg", tone: "ghost" },
  }
);

export const notificationContent = cva(
  "w-80 overflow-hidden bg-surface border border-border will-change-transform ",
  {
    variants: {
      elevation: { 0: "shadow-none", 1: "shadow-md", 2: "shadow-lg" },
      radius: { sm: "rounded-md", md: "rounded-lg", lg: "rounded-xl" },
    },
    defaultVariants: { elevation: 2, radius: "lg" },
  }
);

export const notificationHeader = cva(
  "sticky top-0 z-10 flex items-center justify-between " +
    "border-b border-border/70 bg-surface/95 px-3 py-2 text-sm"
);

export const notificationList = cva("max-h-80 overflow-auto p-1");

export const notificationItem = cva(
  "group flex w-full items-start gap-3 rounded-lg outline-none " +
    "transition-colors data-[highlighted]:bg-surface/80",
  {
    variants: {
      density: { compact: "p-2", comfy: "p-3" },
      unread: { true: "font-medium", false: "font-normal" },
    },
    defaultVariants: { density: "comfy", unread: false },
  }
);

export const unreadDot = cva("mt-1.5 size-2.5 shrink-0 rounded-full", {
  variants: { unread: { true: "bg-brand-600", false: "bg-border" } },
  defaultVariants: { unread: false },
});

export const title = cva("truncate text-sm");
export const message = cva("line-clamp-2 text-xs text-muted-foreground");
export const time = cva("mt-1 text-xs text-muted-foreground/80");
export const footer = cva(
  "border-t border-border/70 bg-surface/95 px-3 py-2 text-center text-sm"
);

export type NotificationContentVariants = VariantProps<
  typeof notificationContent
>;
export type NotificationItemVariants = VariantProps<typeof notificationItem>;
export type BellTriggerVariants = VariantProps<typeof bellTrigger>;
