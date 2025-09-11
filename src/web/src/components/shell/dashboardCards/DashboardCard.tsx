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
import { FiCalendar, FiArrowUpRight } from "react-icons/fi";

export default function DashboardCardsDemo() {
  return (
    <div className="h-full grid grid-cols-12 gap-4 auto-rows-[minmax(0,1fr)]">
      {/* Total balance */}
      <Card className="col-span-12 lg:col-span-4 h-full flex flex-col">
        <CardHeader>
          <div>
            <CardTitle>Total balance</CardTitle>
            <CardDescription>
              Your balance has increased since January
            </CardDescription>
          </div>
          <CardActions>
            <Button
              variant="outline"
              size="icon"
              radius="lg"
              aria-label="Pick period"
            >
              <FiCalendar className="size-5" />
            </Button>
            <KebabMenu
              items={[
                { label: "Refresh", onSelect: () => console.log("Refresh") },
                { type: "separator" },
                { label: "Export", onSelect: () => console.log("Export") },
              ]}
            />
          </CardActions>
        </CardHeader>

        <CardContent className="flex-1 min-h-0">
          <div className="h-full rounded-xl border border-border/70 bg-surface/40 grid place-items-center text-xs text-muted-foreground">
            Area chart
          </div>
        </CardContent>

        <CardFooter className="mt-auto">
          <div />
          <Button variant="outline" radius="lg" rightIcon={<FiArrowUpRight />}>
            View report
          </Button>
        </CardFooter>
      </Card>

      {/* Income & Expenses */}
      <Card className="col-span-12 md:col-span-6 lg:col-span-4 h-full flex flex-col">
        <CardHeader>
          <CardTitle>Income &amp; Expenses</CardTitle>
          <Button
            variant="outline"
            size="icon"
            radius="lg"
            aria-label="Pick period"
          >
            <FiCalendar className="size-5" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 min-h-0">
          <div className="h-full rounded-xl border border-border/70 bg-surface/40 grid place-items-center text-xs text-muted-foreground">
            Bar chart
          </div>
        </CardContent>
      </Card>

      {/* Receipts split summary */}
      <Card className="col-span-12 md:col-span-6 lg:col-span-4 h-full flex flex-col">
        <CardHeader>
          <CardTitle>Receipts split summary</CardTitle>
          <KebabMenu
            items={[
              { label: "Open", onSelect: () => console.log("Open summary") },
            ]}
          />
        </CardHeader>

        <CardContent className="flex-1 min-h-0">
          <div className="h-full rounded-full border border-border/70 bg-surface/40 grid place-items-center text-xs text-muted-foreground">
            Donut
          </div>
        </CardContent>

        <CardFooter className="mt-auto">
          <span className="text-sm text-muted-foreground">
            Food $1,600 · Non-food $1,400
          </span>
          <Button variant="outline" radius="lg" rightIcon={<FiArrowUpRight />}>
            View report
          </Button>
        </CardFooter>
      </Card>

      {/* Spending categories */}
      <Card className="col-span-12 md:col-span-12 lg:col-span-4 h-full flex flex-col">
        <CardHeader>
          <CardTitle>Spending categories</CardTitle>
          <KebabMenu
            items={[
              {
                label: "Manage",
                onSelect: () => console.log("Manage categories"),
              },
            ]}
          />
        </CardHeader>

        <CardContent className="flex-1">
          <div className="h-full min-h-48 rounded-xl border border-border/70 bg-surface/40 grid place-items-center text-xs text-muted-foreground">
            Legend + Donut
          </div>
        </CardContent>

        <CardFooter className="mt-auto">
          <span className="text-sm text-muted-foreground">
            Top: Groceries, Transport
          </span>
          <Button variant="outline" radius="lg" rightIcon={<FiArrowUpRight />}>
            View report
          </Button>
        </CardFooter>
      </Card>

      {/* Latest transactions */}
      <Card className="col-span-12 lg:col-span-8 h-full flex flex-col">
        <CardHeader>
          <CardTitle>Latest transactions</CardTitle>
          <KebabMenu
            items={[
              { label: "Open list", onSelect: () => console.log("Open list") },
            ]}
          />
        </CardHeader>

        <CardContent className="flex-1">
          <div className="h-full min-h-48 rounded-xl border border-border/70 bg-surface/40 grid place-items-center text-xs text-muted-foreground">
            Table
          </div>
        </CardContent>

        <CardFooter className="mt-auto">
          <span className="text-sm text-muted-foreground">
            Updated just now
          </span>
          <Button variant="outline" radius="lg" rightIcon={<FiArrowUpRight />}>
            View all
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
