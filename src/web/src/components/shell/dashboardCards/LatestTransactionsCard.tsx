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
import { TxFilter } from "@/types/transactionFilter";
import { TxFilterButton } from "@/features/transactions/components/TxFilterButton";

export type LatestTransactionsCardProps = {
  title?: string;
  table?: React.ReactNode | ((filter: TxFilter) => React.ReactNode); // TODO: label component
  updatedText?: string;
  onViewAll?: () => void;
  menuItems?: MenuItem[];
  className?: string;

  // period selector
  period?: Period;
  onPeriodChange?: (v: Period) => void;
  periodLabel?: string;

  // filter

  filter: TxFilter;
  onFilterChange: (f: TxFilter) => void;
};

export function LatestTransactionsCard({
  title = "Latest transactions",
  table,
  updatedText = "Updated just now",
  menuItems = [{ label: "Open list", onSelect: () => {} }],
  className = "",
  period,
  onPeriodChange,
  periodLabel = "Period",
  filter,
  onFilterChange,
}: LatestTransactionsCardProps) {
  const renderedTable = React.useMemo(() => {
    if (!table) {
      return (
        <div className="h-full min-h-48 grid place-items-center rounded-xl border border-border/70 bg-surface/40 text-xs text-muted-foreground">
          Table
        </div>
      );
    }
    if (typeof table === "function") return table(filter);

    if (React.isValidElement<{ filter?: TxFilter }>(table)) {
      return React.cloneElement(table, { filter });
    }
    return table;
  }, [table, filter]);

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
          <TxFilterButton value={filter} onChange={onFilterChange} />
          <KebabMenu items={menuItems} />
        </div>
      </CardHeader>

      <CardContent className="flex-1">{renderedTable}</CardContent>

      <CardFooter className="mt-auto">
        {updatedText && (
          <span className="text-sm text-muted-foreground">{updatedText}</span>
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
      </CardFooter>
    </Card>
  );
}
