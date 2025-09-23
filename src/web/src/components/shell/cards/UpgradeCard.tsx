"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/index";
import { Pill } from "@/components/ui/pill/Pill";
import { Skeleton } from "@radix-ui/themes";

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

  loading?: boolean;
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
  pillSize = "sm",
  loading = false,
}: UpgradeCardProps) {
  if (variant === "pill") {
    if (loading) {
      return (
        <span className="inline-block rounded-full overflow-hidden">
          <Skeleton
            width={pillSize === "sm" ? "56px" : "72px"}
            height={pillSize === "sm" ? "22px" : "26px"}
          />
        </span>
      );
    }

    const chip = (
      <Pill size={pillSize} className="mb-2.5" color="var( --color-brand)">
        {label}
      </Pill>
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
      aria-busy={loading}
      className={cn(
        "rounded-xl border p-4 bg-surface",
        loading ? "border-border" : "border-brand/40 hover:border-brand transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {loading ? (
          <div className="h-5 w-32 rounded-md overflow-hidden">
            <Skeleton width="100%" height="100%" />
          </div>
        ) : (
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        )}

        {loading ? (
          <div className="h-[22px] w-[52px] rounded-full overflow-hidden">
            <Skeleton width="100%" height="100%" />
          </div>
        ) : (
          <Pill size="sm" color="var( --color-brand)">
            {label}
          </Pill>
        )}
      </div>

      {loading ? (
        <div className="mt-2 h-4 w-56 rounded-md overflow-hidden">
          <Skeleton width="100%" height="100%" />
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}

      <div className="mt-3">
        {loading ? (
          <div className="h-9 w-full rounded-lg overflow-hidden">
            <Skeleton width="100%" height="100%" />
          </div>
        ) : (
          <Button asChild variant="primary" radius="lg" block>
            <Link href={href}>{ctaLabel}</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
