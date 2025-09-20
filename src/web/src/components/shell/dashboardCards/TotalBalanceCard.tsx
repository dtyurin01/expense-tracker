"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardActions,
} from "@/components/ui/card/Card";
import { Button } from "@/components/ui/button/Button";
import { KebabMenu } from "@/components/ui/menu/KebabMenu";
import { FiArrowUpRight } from "react-icons/fi";
import { DateRangeButton } from "@/components/ui/date/DateRangeButton";
import type { Period } from "@/schemas/period";
import type { MenuItem } from "@/components/ui/menu/menu.types";
import Link from "next/link";

export type TotalBalanceCardProps = {
  title?: string;
  description?: string;
  chart?: React.ReactNode;

  period?: Period;
  onPeriodChange?: (v: Period) => void;
  periodMin?: string;
  periodMax?: string;
  periodLabel?: string;

  onViewReport?: () => void;
  menuItems?: MenuItem[];
  className?: string;
};

export function TotalBalanceCard({
  title = "Total balance",
  description = "Your balance has increased since January",
  chart,
  period,
  onPeriodChange,
  periodMin,
  periodMax,
  periodLabel = "Period",
  menuItems = [
    { label: "Refresh", onSelect: () => {} },
    { type: "separator" },
    { label: "Export", onSelect: () => {} },
  ],
  className = "",
}: TotalBalanceCardProps) {
  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
        </div>
        <CardActions>
          <div className="flex gap-2">
            <DateRangeButton
              period={period}
              onChange={onPeriodChange}
              min={periodMin}
              max={periodMax}
              label={periodLabel}
            />
            <KebabMenu items={menuItems} />
          </div>
        </CardActions>
      </CardHeader>

      <CardContent className="flex-1 min-h-0">
        {chart ?? (
          <div className="h-full rounded-xl border border-border/70 bg-surface/40 grid place-items-center text-xs text-muted-foreground">
            Area chart
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto">
        {description && <CardDescription>{description}</CardDescription>}
        <Button
          className="gap-2"
          size="sm"
          variant="outline"
          radius="lg"
          rightIcon={<FiArrowUpRight />}
        >
          <Link href="/reports/income-expenses">View report</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
