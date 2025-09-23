"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card/Card";
import { Button } from "@/components/ui/button/Button";
import { KebabMenu } from "@/components/ui/menu/KebabMenu";
import { FiArrowUpRight } from "react-icons/fi";
import type { MenuItem } from "@/components/ui/menu/menu.types";
import { Period } from "@/schemas/period";
import { DateRangeButton } from "@/components/ui/date/DateRangeButton";
import Link from "next/link";
import { Skeleton } from "@radix-ui/themes";

export type ReceiptsSplitSummaryCardProps = {
  title?: string;
  donut?: React.ReactNode;
  summaryText?: string;
  onViewReport?: () => void;
  menuItems?: MenuItem[];
  className?: string;

  period?: Period;
  onPeriodChange?: (v: Period) => void;
  periodLabel?: string;

  loading?: boolean;
};

export function ReceiptsSplitSummaryCard({
  title = "Receipts split summary",
  donut,
  summaryText = "Food $1,600 · Non-food $1,400",
  menuItems = [{ label: "Open", onSelect: () => {} }],
  className = "",
  period,
  onPeriodChange,
  periodLabel = "Period",
  loading = false,
}: ReceiptsSplitSummaryCardProps) {
  return (
    <Card
      className={`h-full flex flex-col ${className}`}
      aria-busy={loading}
      aria-live="polite"
    >
      <CardHeader>
        <span className="inline-block rounded-md overflow-hidden">
          <Skeleton loading={loading}>
            <CardTitle>{title}</CardTitle>
          </Skeleton>
        </span>

        <div className={`flex gap-2 ${loading ? "pointer-events-none" : ""}`}>
          <span className="inline-flex rounded-lg overflow-hidden">
            <Skeleton loading={loading}>
              <DateRangeButton
                period={period}
                onChange={onPeriodChange}
                label={periodLabel}
                disabled={loading}
              />
            </Skeleton>
          </span>
          <span className="inline-flex rounded-lg overflow-hidden">
            <Skeleton loading={loading}>
              <KebabMenu items={menuItems} />
            </Skeleton>
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0">
        {loading ? (
          <div className="grid h-full place-items-center">
            <div className="aspect-square w-[70%] max-w-[280px] min-w-[160px] rounded-full overflow-hidden">
              <Skeleton width="100%" height="100%" />
            </div>
          </div>
        ) : (
          donut ?? (
            <div className="h-full rounded-full border border-border/70 bg-surface/40 grid place-items-center text-xs text-muted-foreground">
              Donut
            </div>
          )
        )}
      </CardContent>

      <CardFooter className="mt-auto">
        {loading ? (
          <div className="flex w-full items-center justify-between gap-2">
            <div className="w-[60%] h-[14px] rounded-md overflow-hidden">
              <Skeleton width="100%" height="100%" />
            </div>
            <div className="w-[112px] h-[32px] rounded-lg overflow-hidden">
              <Skeleton width="100%" height="100%" />
            </div>
          </div>
        ) : (
          <>
            {summaryText && (
              <span className="text-sm text-muted-foreground">
                {summaryText}
              </span>
            )}
            <Button
              className="gap-2"
              size="sm"
              variant="outline"
              radius="lg"
              rightIcon={<FiArrowUpRight />}
            >
              <Link href="/reports/income-expenses">View report</Link>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
