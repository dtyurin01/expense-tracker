import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotificationBell } from "./NotificationBell";
import type { NotificationItem } from "@/types/notificationItem";

const demo: NotificationItem[] = [
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

const meta = {
  title: "UI/Notifications/NotificationBell",
  component: NotificationBell,
  parameters: { layout: "centered" },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
    sideOffset: { control: { type: "number", min: 0, max: 32, step: 1 } },
    collisionPadding: { control: { type: "number", min: 0, max: 32, step: 1 } },
  },
} satisfies Meta<typeof NotificationBell>;

export default meta;
type Story = StoryObj<typeof meta>;

const Frame: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="min-h-[260px] w-full max-w-[420px] flex items-center justify-center p-8 bg-background text-foreground">
    {children}
  </div>
);

export const OpenByDefault: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true);
    return (
      <Frame>
        <NotificationBell {...args} open={open} onOpenChange={setOpen} />
      </Frame>
    );
  },
  args: {
    items: demo,
    side: "bottom",
    align: "end",
    sideOffset: 8,
    collisionPadding: 8,
  },
};

export const Empty: Story = {
  render: (args) => (
    <Frame>
      <NotificationBell {...args} />
    </Frame>
  ),
  args: { items: [] },
};

export const ManyItemsScrollable: Story = {
  render: (args) => (
    <Frame>
      <NotificationBell {...args} />
    </Frame>
  ),
  args: {
    items: Array.from({ length: 20 }, (_, i) => ({
      id: String(i + 1),
      title: `Message #${i + 1}`,
      message: "Long notification text to show wrapping and scroll.",
      time: `${i + 1}m ago`,
      unread: i < 3,
    })),
  },
};

export const WithCountOverride: Story = {
  render: (args) => (
    <Frame>
      <NotificationBell {...args} />
    </Frame>
  ),
  args: { items: demo.map((n) => ({ ...n, unread: false })), count: 12 },
};
