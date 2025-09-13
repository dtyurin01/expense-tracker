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
};

export function ReceiptsSplitSummaryCard({
  title = "Receipts split summary",
  donut,
  summaryText = "Food $1,600 · Non-food $1,400",
  onViewReport,
  menuItems = [{ label: "Open", onSelect: () => {} }],
  className = "",
  period,
  onPeriodChange,
  periodLabel = "Period",
}: ReceiptsSplitSummaryCardProps) {
  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="flex gap-2">
          <DateRangeButton
            period={period}
            onChange={onPeriodChange}
            label={periodLabel}
          />
          <KebabMenu items={menuItems} />
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0">
        {donut ?? (
          <div className="h-full rounded-full border border-border/70 bg-surface/40 grid place-items-center text-xs text-muted-foreground">
            Donut
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto">
        {summaryText && (
          <span className="text-sm text-muted-foreground">{summaryText}</span>
        )}
        <Button
          variant="outline"
          radius="lg"
          rightIcon={<FiArrowUpRight />}
          onClick={onViewReport}
        >
          <Link href="/reports/receipts">View all</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
