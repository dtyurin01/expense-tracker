import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { UserCard } from "./UserCard";

const meta: Meta<typeof UserCard> = {
  title: "UI/UserCard",
  component: UserCard,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
  args: {
    name: "Nicholas Brown",
    subtitle: "Member",
    menuItems: [
      { label: "View profile", onSelect: fn() },
      { label: "Send message", onSelect: fn() },
      { type: "separator" },
      { label: "Remove from team", danger: true, onSelect: fn() },
    ],
    onClick: fn(),
  },
  argTypes: {
    onClick: { action: "card-click" },
  },
};
export default meta;

type Story = StoryObj<typeof UserCard>;

export const Default: Story = {};

export const WithoutMenu: Story = {
  args: {
    menuItems: [],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const LongName: Story = {
  args: {
    name: "Nicholas Alexander-Brown the Third of Somewhere",
  },
};

export const CustomAvatarUrl: Story = {
  args: {
    avatarUrl: "https://i.pravatar.cc/96?img=15",
  },
};
  
export const AvatarOnly: Story = {
  args: { variant: "avatar" },
};


export const InList: Story = {
  render: (args) => (
    <div className="space-y-2">
      <UserCard {...args} name="Nicholas Brown" />
      <UserCard {...args} name="Ava Thompson" subtitle="Admin" />
      <UserCard {...args} name="Liam Johnson" subtitle="Viewer" />
    </div>
  ),
};
