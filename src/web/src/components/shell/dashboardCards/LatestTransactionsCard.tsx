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

export type LatestTransactionsCardProps = {
  title?: string;
  table?: React.ReactNode; // TODO: label component
  updatedText?: string;
  onViewAll?: () => void;
  menuItems?: MenuItem[];
  className?: string;
  period?: Period;
  onPeriodChange?: (v: Period) => void;
  periodLabel?: string;
};

export function LatestTransactionsCard({
  title = "Latest transactions",
  table,
  updatedText = "Updated just now",
  onViewAll,
  menuItems = [{ label: "Open list", onSelect: () => {} }],
  className = "",
  period,
  onPeriodChange,
  periodLabel = "Period",
}: LatestTransactionsCardProps) {
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

      <CardContent className="flex-1">
        {table ?? (
          <div className="h-full min-h-48 rounded-xl border border-border/70 bg-surface/40 grid place-items-center text-xs text-muted-foreground">
            Table
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto">
        {updatedText && (
          <span className="text-sm text-muted-foreground">{updatedText}</span>
        )}
        <Button
          variant="outline"
          radius="lg"
          rightIcon={<FiArrowUpRight />}
          onClick={onViewAll}
        >
          <Link href="/transactions">View all</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
