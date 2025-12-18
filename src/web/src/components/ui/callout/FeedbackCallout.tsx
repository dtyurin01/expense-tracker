"use client";

import * as React from "react";
import { Callout } from "@radix-ui/themes";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button/Button";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiX,
} from "react-icons/fi";

export type FeedbackTone = "info" | "success" | "warning" | "error";

export type FeedbackCalloutProps = {
  tone: FeedbackTone;
  title?: string;
  message: React.ReactNode;
  className?: string;

  autoDismissMs?: number | null;

  onDismiss?: () => void;
};

const iconByTone: Record<
  FeedbackTone,
  React.ComponentType<{ className?: string }>
> = {
  info: FiInfo,
  success: FiCheckCircle,
  warning: FiAlertTriangle,
  error: FiAlertCircle,
};

const borderByTone: Record<FeedbackTone, string> = {
  info: "border-info",
  success: "border-success",
  warning: "border-warning",
  error: "border-error",
};

const iconColorByTone: Record<FeedbackTone, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
};

export function FeedbackCallout({
  tone,
  title,
  message,
  className,
  autoDismissMs = 450000,
  onDismiss,
}: FeedbackCalloutProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const [isClosing, setIsClosing] = React.useState(false);

  const close = React.useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);

    window.setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 220);
  }, [isClosing, onDismiss]);

  React.useEffect(() => {
    if (!autoDismissMs || autoDismissMs <= 0) return;

    const id = window.setTimeout(() => {
      close();
    }, autoDismissMs);

    return () => window.clearTimeout(id);
  }, [autoDismissMs, close]);

  if (!isVisible) return null;

  const Icon = iconByTone[tone];
  const toneBorder = borderByTone[tone];
  const toneIcon = iconColorByTone[tone];

  return (
    <div
      className={cn(
        "transition-all duration-200 ease-out overflow-hidden",
        isClosing ? "opacity-0 -translate-y-0.5" : "opacity-100 translate-y-0",
        className
      )}
    >
      <Callout.Root
        color="gray"
        variant="surface"
        className={cn(
          "relative rounded-xl border border-border",
          "border-l-4 rounded-l-md",
          "pr-10",
          toneBorder
        )}
      >
        <div className="flex items-start gap-2 w-full pr-4">
          <div className={cn("mt-3 ml-1 ", toneIcon)} aria-hidden>
            <Icon className="size-4" />
          </div>

          <div className="pr-3">
            <div className="text-sm leading-5">
              {title ? (
                <span className="font-medium text-foreground">{title}</span>
              ) : null}
              {title ? (
                <span className="text-muted-foreground"> — </span>
              ) : null}
              <span className="text-muted-foreground">{message}</span>
            </div>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          radius="full"
          aria-label="Dismiss"
          onClick={close}
          className="border-none absolute pl-6 right-2"
        >
          <FiX className="size-4" aria-hidden />
        </Button>
      </Callout.Root>
    </div>
  );
}
