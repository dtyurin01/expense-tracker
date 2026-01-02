"use client";

import React from "react";
import Tabs from "@/components/ui/tabs/Tabs";
import UserSettings from "@/components/shell/settings/UserSettings";

export default function SettingsChoices() {
  return (
    <Tabs
      defaultValue="users"
      className="pl-2"
      items={[
        {
          value: "users",
          label: "Users",
          content: <UserSettings />,
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
