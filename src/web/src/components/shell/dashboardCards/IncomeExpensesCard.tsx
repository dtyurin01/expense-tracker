"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card/Card";
import { DateRangeButton } from "@/components/ui/date/DateRangeButton";
import type { Period } from "@/schemas/period";
import { Button } from "@/components/ui";
import { FiArrowUpRight } from "react-icons/fi";
import Link from "next/link";
import { Skeleton } from "@radix-ui/themes";

export type IncomeExpensesCardProps = {
  title?: string;
  chart?: React.ReactNode;

  period?: Period;
  onPeriodChange?: (v: Period) => void;
  periodMin?: string;
  periodMax?: string;
  periodLabel?: string;

  className?: string;

  loading?: boolean;
};

export function IncomeExpensesCard({
  title = "Income & Expenses",
  chart,
  period,
  onPeriodChange,
  periodMin,
  periodMax,
  periodLabel = "Period",
  className = "",
  loading = false,
}: IncomeExpensesCardProps) {
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

        <span
          className={`inline-flex rounded-lg overflow-hidden ${
            loading ? "pointer-events-none" : ""
          }`}
        >
          <Skeleton loading={loading}>
            <DateRangeButton
              period={period}
              onChange={onPeriodChange}
              min={periodMin}
              max={periodMax}
              label={periodLabel}
              disabled={loading}
            />
          </Skeleton>
        </span>
      </CardHeader>

      <CardContent className="flex-1 min-h-0">
        {loading ? (
          <div className="h-full min-h-48 rounded-xl overflow-hidden">
            <Skeleton width="100%" height="100%" />
          </div>
        ) : (
          chart ?? (
            <div className="h-full rounded-xl border border-border/70 bg-surface/40 grid place-items-center text-xs text-muted-foreground">
              Bar chart
            </div>
          )
        )}
      </CardContent>

      <CardFooter className="mt-auto flex justify-end">
        {loading ? (
          <div className="w-[112px] h-[32px] rounded-lg overflow-hidden">
            <Skeleton width="100%" height="100%" />
          </div>
        ) : (
          <Button
            className="gap-2"
            size="sm"
            variant="outline"
            radius="lg"
            rightIcon={<FiArrowUpRight />}
          >
            <Link href="/reports/income-expenses">View report</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
