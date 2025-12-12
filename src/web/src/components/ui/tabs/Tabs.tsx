"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import { ReactNode } from "react";

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
}

export default function Tabs({ items, defaultValue, className }: TabsProps) {
  const initial = defaultValue ?? items[0]?.value;

  return (
    <RadixTabs.Root defaultValue={initial} className={className}>
      <RadixTabs.List className="flex gap-8 border-b border-neutral-700">
        {items.map((tab) => (
          <RadixTabs.Trigger
            key={tab.value}
            value={tab.value}
            className="
              relative px-1 py-3 text-sm font-medium
              text-neutral-400 transition
              data-[state=active]:text-white

              after:absolute after:left-0 after:right-0 
              after:bottom-0 after:h-[2px]
              after:bg-white after:rounded-sm
              after:opacity-0 data-[state=active]:after:opacity-100
            "
          >
            {tab.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {items.map((tab) => (
        <RadixTabs.Content key={tab.value} value={tab.value} className="pt-6">
          {tab.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
