"use client";

import * as React from "react";
import {
  TotalBalanceCard,
  IncomeExpensesCard,
  ReceiptsSplitSummaryCard,
  SpendingCategoriesCard,
  LatestTransactionsCard,
} from "@/components/shell/dashboardCards";
import { Period } from "@/schemas/period";
import { getDashboardMock } from "@/mocks/dashboard";
import { AreaChart } from "@/features/charts/components/AreaChart";
import { BarChartIE } from "@/features/charts/components/BarChartIE";
// import { BarChart } from "@/features/charts/BarChart";
// import { DonutChart } from "@/features/charts/DonutChart";
// import { TxTable } from "@/features/transactions/TxTable";

export default function DashboardCards() {
  // single period state to sync all cards
  const [period, setPeriod] = React.useState<Period | undefined>(undefined);

  const resp = React.useMemo(
    () =>
      getDashboardMock(period, {
        topCategories: 10,
        includeLatest: 5,
        currency: "eur", // GET CURRENCY FROM USER PROFILE (CONTEXT)
      }),
    [period]
  );

  return (
    <div className="h-full grid grid-cols-12 gap-4 auto-rows-[minmax(0,1fr)]">
      <TotalBalanceCard
        className="col-span-12 lg:col-span-4"
        period={period}
        onPeriodChange={setPeriod}
        onViewReport={() => console.log("View report: Total balance")}
        menuItems={[
          { label: "Refresh", onSelect: () => console.log("Refresh TB") },
          { type: "separator" },
          { label: "Export", onSelect: () => console.log("Export TB") },
        ]}
        chart={
          <AreaChart
            data={resp.totalBalance}
            currency={resp.currency ? resp.currency : undefined}
          />
        }
      />

      <IncomeExpensesCard
        className="col-span-12 md:col-span-6 lg:col-span-4"
        period={period}
        onPeriodChange={setPeriod}
        chart={
          <BarChartIE
            data={resp.incomeExpenses}
            currency={resp.currency ? resp.currency : undefined}
          />
        }
      />

      <ReceiptsSplitSummaryCard
        className="col-span-12 md:col-span-6 lg:col-span-4"
        period={period}
        onPeriodChange={setPeriod}
        summaryText="Food $1,600 · Non-food $1,400"
        onViewReport={() => console.log("View report: Receipts split")}
        menuItems={[{ label: "Open", onSelect: () => console.log("Open sum") }]}
        // donut={<DonutChart data={...} />}
      />

      <SpendingCategoriesCard
        className="col-span-12 md:col-span-12 lg:col-span-4"
        period={period}
        onPeriodChange={setPeriod}
        footnote="Top: Groceries, Transport"
        onViewReport={() => console.log("View report: Categories")}
        menuItems={[
          { label: "Manage", onSelect: () => console.log("Manage categories") },
        ]}
        // chart={<DonutChart withLegend data={...} />}
      />

      <LatestTransactionsCard
        className="col-span-12 lg:col-span-8"
        period={period}
        onPeriodChange={setPeriod}
        updatedText="Updated just now"
        onViewAll={() => console.log("View all transactions")}
        menuItems={[
          { label: "Open list", onSelect: () => console.log("Open list") },
        ]}
        // table={<TxTable rows={...} />}
      />
    </div>
  );
}
