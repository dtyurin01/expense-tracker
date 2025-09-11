"use client";

import { AppHeader } from "@/components/shell/header/AppHeader";
import AppSidebar from "@/components/shell/sidebar/AppSidebar";

import AddExpenseDialog from "@/features/expenses/components/AddExpenseDialog";

import type { ExpenseCreate } from "@/schemas/expense";
import { useState } from "react";
import { getBaseCategories } from "@/data/categories";
import DashboardCardsDemo from "@/components/shell/dashboardCards/DashboardCard";

export default function AppShell() {
  const [addOpen, setAddOpen] = useState(false);

  const handleCreate = (dto: ExpenseCreate) => {
    // TODO: call API / mutation
    console.log("Create expense:", dto);

    // TODO: Notification When added
  };
  return (
    <div className="bg-background text-foreground">
      <AppSidebar />

      <main className="min-h-svh flex flex-col px-3 pt-5 pl-[6.5rem] md:pl-2 lg:pl-[calc(320px+1.2rem)]">
        <section className="min-w-0 flex-1 flex flex-col gap-6  min-h-0">
          <AppHeader
            title="Dashboard"
            subtitle="Hi Nicholas, here are your financial stats"
            activeSegment="All family"
            segmentOptions={["Personal", "All family"]}
            currency="USD"
            onAddClick={() => setAddOpen(true)}
            onSearchClick={() => console.log("Search")}
            onBellClick={() => console.log("Bell")}
            onSegmentChange={(v) => console.log("Segment:", v)}
            onCurrencyClick={() => console.log("Currency")}
          />
          <div className="grow">
            <DashboardCardsDemo />
          </div>
        </section>
      </main>
      <AddExpenseDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={handleCreate}
        categories={getBaseCategories()}
      />
    </div>
  );
}
