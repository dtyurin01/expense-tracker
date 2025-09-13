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

export type SpendingCategoriesCardProps = {
  title?: string;
  chart?: React.ReactNode;
  footnote?: string;
  onViewReport?: () => void;
  menuItems?: MenuItem[];
  className?: string;
  period?: Period;
  onPeriodChange?: (v: Period) => void;
  periodLabel?: string;
};

export function SpendingCategoriesCard({
  title = "Spending categories",
  chart,
  footnote = "Top: Groceries, Transport",
  onViewReport,
  menuItems = [{ label: "Manage", onSelect: () => {} }],
  className = "",
  period,
  onPeriodChange,
  periodLabel = "Period",
}: SpendingCategoriesCardProps) {
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
        {chart ?? (
          <div className="h-full min-h-48 rounded-xl border border-border/70 bg-surface/40 grid place-items-center text-xs text-muted-foreground">
            Legend + Donut
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto">
        {footnote && (
          <span className="text-sm text-muted-foreground">{footnote}</span>
        )}
        <Button
          variant="outline"
          radius="lg"
          rightIcon={<FiArrowUpRight />}
          onClick={onViewReport}
        >
          View report
        </Button>
      </CardFooter>
    </Card>
  );
}
