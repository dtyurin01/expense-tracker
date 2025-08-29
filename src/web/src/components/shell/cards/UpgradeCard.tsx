"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@radix-ui/themes";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/index";

type UpgradeCardProps = {
  title?: string;
  description?: string;
  daysLeft?: number;
  ctaLabel: string;
  href?: string;
  className: string;
};
export function UpgradeCard({
  title = "Explore plans",
  daysLeft = 7,
  description,
  ctaLabel = "Upgrade",
  href = "pricing",
  className,
}: UpgradeCardProps) {
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
        <Badge
          variant="surface"
          color="cyan"
          className="!rounded-md !px-2"
        >
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
