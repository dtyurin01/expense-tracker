"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  variant?: "hero" | "card";
  align?: "center" | "start";
};

export function EmptyState({
  title,
  description,
  actions,
  icon,
  className,
  variant = "card",
  align = "center",
}: EmptyStateProps) {
  const isHero = variant === "hero";
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-dashed border-border",
        isHero
          ? "bg-surface px-6 py-10 sm:px-10 sm:py-14"
          : "bg-surface/50 p-6 min-h-[180px]", 
        isCenter
          ? "items-center justify-center text-center"
          : "items-start text-left",
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "grid place-items-center rounded-full border border-border/80 text-brand bg-brand/10",
            isHero ? "size-14 mb-4" : "size-10 mb-3"
          )}
        >
          {icon}
        </div>
      )}

      <h2 className={cn(isHero ? "text-xl" : "text-sm", "font-semibold")}>
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            isHero ? "mt-2" : "mt-1",
            "max-w-prose text-sm text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}

      {actions && (
        <div
          className={cn(
            isHero ? "mt-5" : "mt-3",
            "flex flex-wrap gap-2",
            isCenter && "justify-center"
          )}
        >
          {actions}
        </div>
      )}
    </div>
  );
}

