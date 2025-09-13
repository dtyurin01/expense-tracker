"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card/Card";
import { DateRangeButton } from "@/components/ui/date/DateRangeButton";
import type { Period } from "@/schemas/period";

export type IncomeExpensesCardProps = {
  title?: string;
  chart?: React.ReactNode;

  period?: Period;
  onPeriodChange?: (v: Period) => void;
  periodMin?: string;
  periodMax?: string;
  periodLabel?: string;

  className?: string;
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
}: IncomeExpensesCardProps) {
  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <DateRangeButton
          period={period}
          onChange={onPeriodChange}
          min={periodMin}
          max={periodMax}
          label={periodLabel}
        />
      </CardHeader>

      <CardContent className="flex-1 min-h-0">
        {chart ?? (
          <div className="h-full rounded-xl border border-border/70 bg-surface/40 grid place-items-center text-xs text-muted-foreground">
            Bar chart
          </div>
        )}
      </CardContent>
    </Card>
  );
}
