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
import { Skeleton } from "@radix-ui/themes";

export type LatestTransactionsCardProps = {
  title?: string;
  table?: React.ReactNode | ((filter: TxFilter) => React.ReactNode);
  // TODO: label component
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

  // loading state
  loading?: boolean;
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
  loading = false,
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
    <Card
      className={`h-full flex flex-col ${className}`}
      aria-busy={loading}
      aria-live="polite"
    >
      <CardHeader>
        {/* Title with clipping */}
        <span className="inline-block rounded-md overflow-hidden">
          <Skeleton loading={loading}>
            <CardTitle>{title}</CardTitle>
          </Skeleton>
        </span>

        {/* Actions with clipping */}
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
              <TxFilterButton value={filter} onChange={onFilterChange} />
              ёё
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
          <div className="h-full min-h-48 rounded-xl overflow-hidden">
            <Skeleton width="100%" height="100%" />
          </div>
        ) : (
          renderedTable
        )}
      </CardContent>

      <CardFooter className="mt-auto">
        {loading ? (
          <div className="flex w-full items-center justify-between gap-2">
            {/* updated text line */}
            <div className="w-[40%] h-[14px] rounded-md overflow-hidden">
              <Skeleton width="100%" height="100%" />
            </div>
            {/* button */}
            <div className="w-[112px] h-[32px] rounded-lg overflow-hidden">
              <Skeleton width="100%" height="100%" />
            </div>
          </div>
        ) : (
          <>
            {updatedText && (
              <span className="text-sm text-muted-foreground">
                {updatedText}
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
