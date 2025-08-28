import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select, SelectItem, SelectSeparator } from "./Select";
import {
  TbCurrencyEuro,
  TbCurrencyPound,
  TbCurrencyHryvnia,
  TbCurrencyDollar,
} from "react-icons/tb";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  parameters: { layout: "centered" },
  args: {
    variant: "secondary",
    size: "md",
    radius: "lg",
    block: false,
    disabled: false,
    placeholder: "Select…",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "icon"],
    },
    radius: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
    },
    block: { control: "boolean" },
    disabled: { control: "boolean" },
    leftSlot: { table: { disable: true } },
    children: { table: { disable: true } },
  },
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: { defaultValue: "usd" },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="usd">USD</SelectItem>
      <SelectItem value="eur">EUR</SelectItem>
      <SelectItem value="gbp">GBP</SelectItem>
      <SelectSeparator />
      <SelectItem value="uah">UAH</SelectItem>
    </Select>
  ),
};

export const OutlinePillRate: Story = {
  args: {
    variant: "outline",
    radius: "full",
    size: "md",
    defaultValue: "r1",
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="r1">$ 41.30 / 41.84</SelectItem>
      <SelectItem value="r2">$ 40.95 / 41.50</SelectItem>
      <SelectItem value="r3">$ 40.10 / 40.72</SelectItem>
    </Select>
  ),
};

export const CurrencyCodeCompact: Story = {
  args: {
    variant: "secondary",
    radius: "lg",
    size: "sm",
    defaultValue: "usd",
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="usd">USD</SelectItem>
      <SelectItem value="eur">EUR</SelectItem>
      <SelectItem value="gbp">GBP</SelectItem>
    </Select>
  ),
};

export const CurrencySymbol: Story = {
  args: {
    variant: "secondary",
    radius: "md",
    size: "md",
    defaultValue: "gbp",
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="gbp">£</SelectItem>
      <SelectItem value="usd">$</SelectItem>
      <SelectItem value="eur">€</SelectItem>
    </Select>
  ),
};

export const WithLeftSlot: Story = {
  args: {
    variant: "secondary",
    radius: "lg",
    size: "md",
    defaultValue: "usd",
    leftSlot: <TbCurrencyDollar />,
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="usd">USD</SelectItem>
      <SelectItem value="eur">EUR</SelectItem>
      <SelectItem value="gbp">GBP</SelectItem>
    </Select>
  ),
};

export const WithLeftSlotDynamic: Story = {
  args: {
    variant: "secondary",
    radius: "lg",
    size: "md",
  },
  render: (args) => {
    const [val, setVal] = React.useState("usd");

    const icons: Record<string, React.ReactNode> = {
      usd: <TbCurrencyDollar className="size-4" />,
      eur: <TbCurrencyEuro className="size-4" />,
      gbp: <TbCurrencyPound className="size-4" />,
      uah: <TbCurrencyHryvnia className="size-4" />,
    };

    return (
      <Select
        {...args}
        value={val}
        onValueChange={setVal}
        leftSlot={icons[val]} 
      >
        <SelectItem value="usd" leftIcon={<TbCurrencyDollar className="size-4" />}>
          USD
        </SelectItem>
        <SelectItem
          value="eur"
          leftIcon={<TbCurrencyEuro className="size-4" />}
        >
          EUR
        </SelectItem>
        <SelectItem
          value="gbp"
          leftIcon={<TbCurrencyPound className="size-4" />}
        >
          GBP
        </SelectItem>
        <SelectSeparator />
        <SelectItem
          value="uah"
          leftIcon={<TbCurrencyHryvnia className="size-4" />}
        >
          UAH
        </SelectItem>
      </Select>
    );
  },
};

export const Block: Story = {
  args: {
    block: true,
    defaultValue: "usd",
  },
  render: (args) => (
    <div className="w-[360px]">
      <Select {...args}>
        <SelectItem value="usd">USD</SelectItem>
        <SelectItem value="eur">EUR</SelectItem>
        <SelectItem value="gbp">GBP</SelectItem>
      </Select>
    </div>
  ),
};
