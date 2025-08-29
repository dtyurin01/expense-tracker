import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KebabMenu } from "./KebabMenu";
import type { MenuItem } from "./menu.types";
import {
  FiUser,
  FiLogOut,
  FiEdit,
  FiTrash2,
  FiMoreHorizontal,
} from "react-icons/fi";
import { Button } from "@/components/ui/index";
import React from "react";

const meta: Meta<typeof KebabMenu> = {
  title: "UI/Menu/KebabMenu",
  component: KebabMenu,
  parameters: {
    layout: "centered",
  },
  args: {
    items: [
      { type: "label", label: "Actions" },
      {
        label: "Profile",
        icon: <FiUser />,
        onSelect: () => console.log("Profile"),
      },
      { label: "Edit", icon: <FiEdit />, onSelect: () => console.log("Edit") },
      { type: "separator" },
      {
        label: "Logout",
        icon: <FiLogOut />,
        danger: true,
        onSelect: () => console.log("Logout"),
      },
    ] as MenuItem[],
    elevation: 2,
    radius: "md",
    density: "comfy",
    align: "end",
    side: "bottom",
    sideOffset: 6,
  },
  argTypes: {
    elevation: { control: "inline-radio", options: [0, 1, 2] },
    radius: { control: "inline-radio", options: ["sm", "md", "lg"] },
    density: { control: "inline-radio", options: ["compact", "comfy"] },
    align: { control: "inline-radio", options: ["start", "end", "center"] },
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof KebabMenu>;

export const Default: Story = {};

export const WithDanger: Story = {
  args: {
    items: [
      { label: "Edit", icon: <FiEdit />, onSelect: () => console.log("Edit") },
      { type: "separator" },
      {
        label: "Delete",
        icon: <FiTrash2 />,
        danger: true,
        onSelect: () => console.log("Delete"),
      },
    ],
  },
};

export const Compact: Story = {
  args: {
    density: "compact",
  },
};

export const LinkItems: Story = {
  args: {
    items: [
      { type: "label", label: "Links", className: "" },
      {
        label: "Open Docs",
        href: "https://example.com",
        icon: <FiMoreHorizontal />,
        target: "_blank",
      },
      { type: "separator" },
      {
        label: "Profile",
        icon: <FiUser />,
        onSelect: () => console.log("Action still works"),
      },
    ],
  },
};

export const CustomTrigger: Story = {
  args: {
    trigger: (
      <Button variant="outline" size="sm" radius="lg">
        Actions
      </Button>
    ),
  },
};

export const DisabledItems: Story = {
  args: {
    items: [
      {
        label: "Profile",
        icon: <FiUser />,
        disabled: true,
        onSelect: () => {},
      },
      { label: "Edit", icon: <FiEdit />, onSelect: () => console.log("Edit") },
      { type: "separator" },
      {
        label: "Logout",
        icon: <FiLogOut />,
        danger: true,
        onSelect: () => console.log("Logout"),
      },
    ],
  },
};

