"use client";

import React from "react";
import Tabs from "@/components/ui/tabs/Tabs";
import { UserCard } from "@/components/shell/cards/UserCard";

export default function SettingsChoices() {
  return (
    <Tabs
      defaultValue="users"
      items={[
        {
          value: "users",
          label: "Users",
          content: (
            <UserCard
              variant="full"
              subtitle=""
              size="lg"
              nameSize="lg"
              onEditClick={() => console.log("edit")}
              name="Nicholas Brown"
              aria-label="Open profile"
            />
          ),
        },
        {
          value: "categories",
          label: "Categories",
          content: <div>Categories</div>,
        },
        {
          value: "sync",
          label: "Synchronization",
          content: <div>Sync block</div>,
        },
        {
          value: "subscription",
          label: "Subscription",
          content: <div>Subscription info</div>,
        },
      ]}
    />
  );
}
