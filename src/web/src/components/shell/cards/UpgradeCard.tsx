"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@radix-ui/themes";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/index";

type UpgradeCardProps = {
  variant?: "full" | "pill";
  title?: string;
  description?: string;
  daysLeft?: number;
  ctaLabel?: string;
  href?: string;
  className?: string;

  label?: string; 
  pillSize?: "sm" | "md"; 
};

export function UpgradeCard({
  variant = "full",
  title = "Explore plans",
  daysLeft = 7,
  description,
  ctaLabel = "Upgrade",
  href = "/pricing",
  className,
  label = "pro",
  pillSize = "md",
}: UpgradeCardProps) {
  if (variant === "pill") {
    const pad =
      pillSize === "sm" ? "!px-2 !py-0.5 text-xs" : "!px-3 !py-1 text-sm";
    const chip = (
      <Badge
        variant="surface"
        color="cyan"
        className={cn("!rounded-full", pad, className)}
      >
        {label}
      </Badge>
    );

    return href ? (
      <Link
        href={href}
        prefetch={false}
        aria-label={`Open ${label} plan`}
        className="inline-block"
      >
        {chip}
      </Link>
    ) : (
      chip
    );
  }

  const text =
    description ??
    `Free trial ends soon — ${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;

  return (
    <section
      aria-label="Billing upgrade"
      className={cn(
        "rounded-xl border p-4 bg-surface",
        "border-brand/40 hover:border-brand transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <Badge variant="surface" color="cyan" className="!rounded-md !px-2">
          pro
        </Badge>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{text}</p>

      <div className="mt-3">
        <Button asChild variant="primary" radius="lg" block>
          <Link href={href}>{ctaLabel}</Link>
        </Button>
      </div>
    </section>
  );
}
