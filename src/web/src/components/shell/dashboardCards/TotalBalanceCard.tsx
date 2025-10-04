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
import { FiArrowUpRight, FiPlusCircle, FiTrendingUp } from "react-icons/fi";
import { DateRangeButton } from "@/components/ui/date/DateRangeButton";
import type { Period } from "@/schemas/period";
import type { MenuItem } from "@/components/ui/menu/menu.types";
import Link from "next/link";
import { Skeleton } from "@radix-ui/themes";
import { EmptyState } from "@/components/empty/EmptyState";
import { useModal } from "@/features/expenses/hooks/useModal";

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

  loading?: boolean;

  anyTx?: boolean;
  hasTimeseries?: boolean;
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
  loading = false,
  anyTx = false,
  hasTimeseries = false,
}: TotalBalanceCardProps) {
  const { open } = useModal();

  if (!hasTimeseries && !loading) {
    return (
      <EmptyState
        icon={<FiTrendingUp className="size-5" aria-hidden />}
        className="col-span-4"
        title={anyTx ? "No data for selected period" : "No data yet"}
        description={
          anyTx
            ? "Try expanding the date range or add more transactions to build your balance timeline."
            : "Add your first transaction to start your balance timeline."
        }
        actions={
          <Button
            leftIcon={<FiPlusCircle />}
            onClick={() => open("add-transaction")}
          >
            Add transaction
          </Button>
        }
      />
    );
  }
  return (
    <Card className={`h-full flex flex-col ${className}`} aria-busy={loading}>
      <CardHeader>
        <div>
          <span className="inline-block rounded-md overflow-hidden">
            <Skeleton loading={loading}>
              <CardTitle>{title}</CardTitle>
            </Skeleton>
          </span>
        </div>

        <CardActions>
          <div className={`flex gap-2 ${loading ? "pointer-events-none" : ""}`}>
            <span className="inline-flex rounded-lg overflow-hidden">
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

            <span className="inline-flex rounded-lg overflow-hidden">
              <Skeleton loading={loading}>
                <KebabMenu items={menuItems} />
              </Skeleton>
            </span>
          </div>
        </CardActions>
      </CardHeader>

      <CardContent className="flex-1 min-h-0">
        {loading ? (
          <div className="h-full min-h-[160px] rounded-xl overflow-hidden">
            <Skeleton width="100%" height="100%" />
          </div>
        ) : (
          chart ?? (
            <div className="h-full rounded-xl border border-border/70 bg-surface/40 grid place-items-center text-xs text-muted-foreground">
              Area chart
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
          </>
        )}
      </CardFooter>
    </Card>
  );
}
