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
import { FiArrowUpRight, FiPlusCircle, FiTag } from "react-icons/fi";
import type { MenuItem } from "@/components/ui/menu/menu.types";
import { Period } from "@/schemas/period";
import { DateRangeButton } from "@/components/ui/date/DateRangeButton";
import Link from "next/link";
import { Skeleton } from "@radix-ui/themes";
import { useModal } from "@/features/expenses/hooks/useModal";
import { EmptyState } from "@/components/empty/EmptyState";

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
  loading?: boolean;
  anyTx?: boolean;
  hasCategories?: boolean;
};

export function SpendingCategoriesCard({
  title = "Spending categories",
  chart,
  footnote = "Top: Groceries, Transport",
  menuItems = [{ label: "Manage", onSelect: () => {} }],
  className,
  period,
  onPeriodChange,
  periodLabel = "Period",
  loading = false,
  anyTx = false,
  hasCategories = false,
}: SpendingCategoriesCardProps) {
  const { open } = useModal();

  if (!hasCategories && !loading) {
    return (
      <EmptyState
        icon={<FiTag className="size-5" aria-hidden />}
        className="col-span-4"
        title={anyTx ? "No categorized spending yet" : "No data yet"}
        description={
          anyTx
            ? "Your transactions don’t have categories yet. Categorize them to see the breakdown."
            : "Add your first transaction to see spending by categories."
        }
        actions={
          anyTx ? (
            <>
              <Button
                leftIcon={<FiPlusCircle />}
                onClick={() => open("add-transaction")}
              >
                Add transaction
              </Button>
              <Button asChild size="md" variant="outline">
                <Link href="/settings/categories">Manage categories</Link>
              </Button>
            </>
          ) : (
            <Button
              leftIcon={<FiPlusCircle />}
              onClick={() => open("add-transaction")}
            >
              Add transaction
            </Button>
          )
        }
      />
    );
  }

  return (
    <Card
      className={`h-full flex flex-col ${className}`}
      aria-busy={loading}
      aria-live="polite"
    >
      <CardHeader>
        <span className="inline-block">
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
          <div className="h-full min-h-48 rounded-xl overflow-hidden">
            <Skeleton width="100%" height="100%" />
          </div>
        ) : (
          chart ?? (
            <div className="h-full min-h-48 rounded-xl border border-border/70 bg-surface/40 grid place-items-center text-xs text-muted-foreground">
              Legend + Donut
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
            <div className="w-[104px] h-[32px] rounded-lg overflow-hidden">
              <Skeleton width="100%" height="100%" />
            </div>
          </div>
        ) : (
          <>
            {footnote && (
              <span className="text-sm text-muted-foreground">{footnote}</span>
            )}
            <Button
              className="gap-2"
              size="sm"
              variant="outline"
              radius="lg"
              rightIcon={<FiArrowUpRight />}
            >
              <Link href="/reports/income-expenses">View all</Link>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
