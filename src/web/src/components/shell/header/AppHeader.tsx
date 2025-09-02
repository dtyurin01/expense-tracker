"use client";

import * as React from "react";
import { FiPlus } from "react-icons/fi";
import { cn } from "@/lib/cn";
import { NotificationBell } from "@/components/ui/notifications/NotificationBell";
import { NotificationItem } from "@/types/notification";
import { Button } from "@/components/ui";
import SearchButton from "@/components/ui/search/SearchButton";
import { CurrencySelect } from "@/components/ui/currencySelector/CurrencySelect";
import { SegmentedControl } from "@/components/ui/segmentedControl/SegmentedControl";

type DashboardHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;

  // action buttons (Row 1)
  onSearchClick?: () => void;
  onBellClick?: () => void;
  onAddClick?: () => void;
  showBellDot?: boolean;

  //  Row 2
  segmentOptions?: string[]; // ["Personal", "All family"]
  activeSegment?: string; // "All family"
  onSegmentChange?: (value: string) => void;

  currency?: string; // "USD"
  onCurrencyClick?: () => void;
};

// GET NOTIFICATION DATA

const initial: NotificationItem[] = [
  {
    id: "1",
    title: "New comment",
    message: "Alex replied",
    time: "2m ago",
    unread: true,
    href: "/inbox/1",
  },
  {
    id: "2",
    title: "Payment received",
    message: "Invoice #1042",
    time: "Today, 14:12",
  },
];

export function DashboardHeader({
  title,
  subtitle,
  className,
  onSearchClick,
  onAddClick,
  segmentOptions = ["Personal", "All family"],
}: DashboardHeaderProps) {
  const [items, setItems] = React.useState<NotificationItem[]>(initial);
  const [open, setOpen] = React.useState(false);
  const [currency, setCurrency] = React.useState("usd");
  const [value, setValue] = React.useState(segmentOptions[0]);

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <header className={cn("space-y-4", className)}>
      <div className="flex items-center">
        <div className="pl-2 min-w-0">
          <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-md text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <SearchButton />

          <NotificationBell
            items={items}
            open={open}
            onOpenChange={setOpen}
            onMarkAllRead={markAllRead}
            side="bottom"
            align="end"
            sideOffset={8}
            collisionPadding={8}
          />

          <Button
            onClick={onAddClick}
            variant="primary"
            size="md"
            radius="lg"
            leftIcon={<FiPlus aria-hidden />}
          >
            Add transcation
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="ml-auto flex items-center gap-2">
          <SegmentedControl
            options={segmentOptions}
            value={value}
            onChange={setValue}
            size="sm"
            radius="lg"
            className="bg-surface/60"
          />

          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
      </div>
    </header>
  );
}
