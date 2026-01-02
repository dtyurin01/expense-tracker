export const MAX_ACTIVE_TOASTS = 3;

export type FeedbackToastVariant = "info" | "success" | "warning" | "error";

export const toastConfig = {
  position: "bottom-right" as const,
  durations: {
    default: 4000,
    success: 2000,
  },
  classNames: {
    base: "rounded-xl border border-brand bg-surface! text-foreground! px-4 py-3 shadow-lg",
    info: "border-l-4 border-brand",
    success: "border-l-4 border-success",
    warning: "border-l-4 border-warning",
    error: "border-l-4 border-error",
  } satisfies Record<"base" | FeedbackToastVariant, string>,
} as const;
