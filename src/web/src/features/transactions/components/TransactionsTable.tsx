"use client";

import * as React from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/cn";
import { dayMonthYearLabel, formatMoney } from "@/lib/format";
import type { CurrencyCode } from "@/lib/currencies";
import type { TxRow } from "@/mocks/dashboard";
import { TxFilter } from "@/types/transactionFilter";
import { Pill } from "@/components/ui/pill/Pill";

type Props = {
  rows: TxRow[];
  currency: CurrencyCode;
  filter?: TxFilter;
  className?: string;
  height?: number | string;
};

export function TransactionsTable({
  rows,
  currency,
  filter = "all",
  className,
  height = 300,
}: Props) {
  const filtered = React.useMemo(() => {
    if (filter === "income") return rows.filter((r) => r.amount > 0);
    if (filter === "expense") return rows.filter((r) => r.amount < 0);
    return rows;
  }, [rows, filter]);
  return (
    <div className={cn(" bg-surface/40", className)}>
      {/* header */}
      <div className="grid grid-cols-[1.1fr_1fr_1fr_0.9fr] items-center px-3 py-1 text-sm text-muted-foreground">
        <div>Card</div>
        <div>Date</div>
        <div>Category</div>
        <div className="text-right">Amount</div>
      </div>

      <ScrollArea.Root className="relative w-full overflow-hidden">
        <ScrollArea.Viewport
          className="h-full w-full"
          style={{
            height: typeof height === "number" ? `${height}px` : height,
          }}
        >
          <ul className="divide-y divide-border/70">
            {filtered.map((tx) => {
              const isIncome = tx.amount > 0;
              return (
                <li
                  key={tx.id}
                  className="grid grid-cols-[1.1fr_1fr_1fr_0.9fr] items-center px-3 py-3"
                >
                  <div className="font-mono text-sm text-foreground/90">
                    {tx.cardMasked}
                  </div>
                  <div className="text-sm">{dayMonthYearLabel(tx.dateISO)}</div>
                  <div>
                    <Pill color={tx.color}>{tx.category}</Pill>
                  </div>
                  <div
                    className={cn(
                      "text-right tabular-nums",
                      isIncome ? "text-success" : "text-error"
                    )}
                  >
                    {isIncome ? "+" : ""}
                    {formatMoney(Math.abs(tx.amount), currency)}
                  </div>
                </li>
              );
            })}
          </ul>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex select-none touch-none bg-border/40 p-0.5"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-full bg-border" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
