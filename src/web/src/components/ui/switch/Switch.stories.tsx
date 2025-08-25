import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Switch } from "./Switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  args: {
    size: "md",
    checked: true,
    disabled: false,
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const On: Story = {};

export const Off: Story = { args: { checked: false } };

export const Disabled: Story = { args: { disabled: true } };

export const WithLabel: Story = {
  render: (args) => (
    <label className="inline-flex items-center gap-2">
      <Switch {...args} id="sw1" />
      <span>Enable analytics</span>
    </label>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <Switch {...args} size="sm" defaultChecked aria-label="sm" />
      <Switch {...args} size="md" defaultChecked aria-label="md" />
      <Switch {...args} size="lg" defaultChecked aria-label="lg" />
    </div>
  ),
};
