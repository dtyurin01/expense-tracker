"use client";

import { AppHeader } from "@/components/shell/header/AppHeader";
import AppSidebar from "@/components/shell/sidebar/AppSidebar";

import AddTransactionDialog from "@/features/expenses/components/AddTransactionDialog";

import type { ExpenseCreate } from "@/schemas/expense";
import { useState } from "react";
import { getBaseCategories } from "@/data/categories";
import DashboardCards from "@/components/shell/dashboardCards/DashboardCards";
import { cn } from "@/lib/cn";
import { useModal } from "@/features/expenses/hooks/useModal";

export default function AppShell() {
  const [mdOpen, setMdOpen] = useState(true);
  const { modal, open, close } = useModal();

  const handleCreate = (dto: ExpenseCreate) => {
    // TODO: call API / mutation
    console.log("Create expense:", dto);

    // TODO: Notification When added
  };
  return (
    <div className="bg-background text-foreground min-h-svh">
      <div
        className={cn(
          "grid transition-[grid-template-columns] duration-200 gap-3 p-2 min-h-svh",
          mdOpen
            ? "grid-cols-[5rem_1fr] lg:grid-cols-[318px_1fr]"
            : "grid-cols-[0_1fr] lg:grid-cols-[318px_1fr]"
        )}
      >
        <AppSidebar mdOpen={mdOpen} setMdOpen={setMdOpen} />

        <main className="h-full flex flex-col min-h-0 px-1 lg:pt-3">
          <section className="min-w-0 flex-1 flex flex-col gap-6 min-h-0">
            <AppHeader
              title="Dashboard"
              subtitle="Hi Nicholas, here are your financial stats"
              activeSegment="All family"
              segmentOptions={["Personal", "All family"]}
              currency="USD"
              onAddClick={() => open("add-transaction")}
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
      <AddTransactionDialog
        open={modal === "add-transaction"}
        onOpenChange={(v) => (v ? open("add-transaction") : close())}
        onCreate={handleCreate}
        categories={getBaseCategories()}
      />
    </div>
  );
}
