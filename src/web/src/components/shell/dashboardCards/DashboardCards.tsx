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
import { DashboardResponse, getDashboardMock } from "@/mocks/dashboard";
import { AreaChart } from "@/features/charts/components/AreaChart";
import { BarChartIE } from "@/features/charts/components/BarChartIE";
import { ReceiptsDonut } from "@/features/charts/components/ReceiptsDonut";
import { CategoriesDonut } from "@/features/charts/components/CategoriesDonut";
import { TxFilter } from "@/types/transactionFilter";
import { TransactionsTable } from "@/features/transactions/components/TransactionsTable";
import {
  hasAnyData,
  hasAnyTx,
  hasCategories,
  hasSeries,
  hasTimeseries,
} from "@/lib/hasAnyData";
import DashboardEmpty from "@/components/empty/EmptyDashboard";

export default function DashboardCards() {
  // single period state to sync all cards
  const [period, setPeriod] = React.useState<Period | undefined>(undefined);
  const [filter, setFilter] = React.useState<TxFilter>("all");

  const resp = React.useMemo<DashboardResponse>(
    () =>
      getDashboardMock(period, {
        topCategories: 10,
        includeLatest: 5,
        currency: "eur", // GET CURRENCY FROM USER PROFILE (CONTEXT)
      }),
    [period]
  );

  if (!resp || !hasAnyData(resp)) {
    return <DashboardEmpty />;
  }

  return (
    <div className="h-full grid grid-cols-12 gap-3 auto-rows-[minmax(0,1fr)]">
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
        chart={<AreaChart data={resp.totalBalance} currency={resp.currency} />}
        anyTx={hasAnyTx(resp)}
        hasTimeseries={hasTimeseries(resp)}
      />

      <IncomeExpensesCard
        className="col-span-12 md:col-span-6 lg:col-span-4"
        period={period}
        onPeriodChange={setPeriod}
        chart={
          <BarChartIE data={resp.incomeExpenses} currency={resp.currency} />
        }
        hasSeries={hasSeries(resp)}
      />

      <ReceiptsSplitSummaryCard
        className="col-span-12 md:col-span-6 lg:col-span-4"
        period={period}
        onPeriodChange={setPeriod}
        summaryText="Food $1,600 · Non-food $1,400"
        onViewReport={() => console.log("View report: Receipts split")}
        menuItems={[{ label: "Open", onSelect: () => console.log("Open sum") }]}
        donut={
          <ReceiptsDonut data={resp.receiptsSplit} currency={resp.currency} />
        }
        anyTx={hasAnyTx(resp)}
        hasReceipts={hasSeries(resp)}
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
        chart={
          <CategoriesDonut
            data={resp.categories}
            currency={resp.currency}
            cutout="60%"
          />
        }
        anyTx={hasAnyTx(resp)}
        hasCategories={hasCategories(resp)}
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
        filter={filter}
        onFilterChange={setFilter}
        table={
          <TransactionsTable
            rows={resp.latestTransactions}
            currency={resp.currency}
            height={260}
          />
        }
      />
    </div>
  );
}
