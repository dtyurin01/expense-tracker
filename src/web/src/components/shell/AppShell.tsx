"use client";

import { AppHeader } from "@/components/shell/header/AppHeader";
import AppSidebar from "@/components/shell/sidebar/AppSidebar";

import AddExpenseDialog from "@/features/expenses/components/AddExpenseDialog";

import type { ExpenseCreate } from "@/schemas/expense";
import { useState } from "react";
import { getBaseCategories } from "@/data/categories";
import DashboardCards from "@/components/shell/dashboardCards/DashboardCards";

export default function AppShell() {
  const [addOpen, setAddOpen] = useState(false);

  const handleCreate = (dto: ExpenseCreate) => {
    // TODO: call API / mutation
    console.log("Create expense:", dto);

    // TODO: Notification When added
  };
  return (
    <div className="bg-background text-foreground min-h-svh">
      <div className="grid grid-cols-[5rem_1fr] lg:grid-cols-[318px_1fr] gap-3 p-2 min-h-svh">
        <AppSidebar />

        <main className="h-full flex flex-col min-h-0 px-1 lg:pt-3">
          <section className="min-w-0 flex-1 flex flex-col gap-6 min-h-0">
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
            <div className="grow flex flex-col min-h-0">
              <DashboardCards />
            </div>
          </section>
        </main>
      </div>
      <AddExpenseDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={handleCreate}
        categories={getBaseCategories()}
      />
    </div>
  );
}
