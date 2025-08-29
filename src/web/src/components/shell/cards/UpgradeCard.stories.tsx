import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UpgradeCard } from "./UpgradeCard";

const meta: Meta<typeof UpgradeCard> = {
  title: "Sidebar/Upgrade Card",
  component: UpgradeCard,
  parameters: { layout: "centered" },
  args: {
    title: "Explore plans",
    daysLeft: 7,
    ctaLabel: "Upgrade",
    href: "/pricing",
  },
  decorators: [
    (Story) => (
      <div className="w-72 p-4 bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof UpgradeCard>;

export const Default: Story = {};

export const OneDayLeft: Story = {
  args: { daysLeft: 1 },
};

export const WithCustomDescription: Story = {
  args: {
    description:
      "You're on the Free plan. Unlock more features and priority support.",
  },
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <div className="dark w-72 p-4 bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

