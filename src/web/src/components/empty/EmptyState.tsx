"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  actions,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        `border border-dashed border-border rounded-xl bg-surface`,
        "px-6 py-10 sm:px-10 sm:py-14",
        className
      )}
    >
      {icon && (
        <div className="mb-4 grid place-items-center rounded-full bg-surface/50 border border-border size-14 text-muted-foreground">
          {icon}
        </div>
      )}
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && (
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {actions && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
