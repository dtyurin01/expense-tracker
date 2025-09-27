"use client";

import * as React from "react";
import { EmptyState } from "@/components/empty/EmptyState";
import { Button } from "@/components/ui/button/Button";
import { FiPieChart, FiPlusCircle, FiLink } from "react-icons/fi";
import Link from "next/link";
import { tasks } from "@/features/charts/config/emptyConfig";
import { useModal } from "@/features/expenses/hooks/useModal";

export default function DashboardEmpty() {
  const { open } = useModal();

  return (
    <div className="h-full w-full">
      <EmptyState
        icon={<FiPieChart className="size-6" aria-hidden />}
        title="No data yet"
        description="Add your first transaction or connect a card — we’ll generate charts for income/expenses, categories, and receipts."
        variant="hero"
        align="center"
        actions={
          <>
            <Button
              leftIcon={<FiPlusCircle />}
              onClick={() => open("add-transaction")}
            >
              Add transaction
            </Button>
            <Button variant="outline" leftIcon={<FiLink />}>
              Connect card/app
            </Button>
          </>
        }
        className="mx-auto max-w-content"
      />

      <ul
        role="list"
        className="mx-auto mt-6 grid max-w-4xl gap-3 sm:grid-cols-2"
      >
        {tasks.map((s, i) => {
          const Icon = s.icon;
          return (
            <li
              key={i}
              className="group rounded-xl border border-border bg-surface/50 p-4 transition-colors  hover:bg-foreground/1.5 active:bg-foreground/2 focus-within:ring-2 focus-within:ring-brand/40"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-grid size-7 place-items-center rounded-lg bg-brand/15 text-brand">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{s.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {s.text}
                  </div>

                  {s.href && (
                    <Button
                      asChild
                      variant="ghost"
                      size="xs"
                      className="mt-2 px-0 text-brand hover:underline"
                    >
                      <Link href={s.href}>{s.linkLabel}</Link>
                    </Button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
