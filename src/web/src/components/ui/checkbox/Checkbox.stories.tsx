import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  args: {
    size: "md",
    checked: true,
    disabled: false,
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {};

export const Unchecked: Story = {
  args: { checked: false },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithLabel: Story = {
  render: (args) => (
    <label className="inline-flex items-center gap-2">
      <Checkbox {...args} id="cb1" />
      <span>Receive notifications</span>
    </label>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-5">
      <Checkbox {...args} size="xs" defaultChecked aria-label="xs" />
      <Checkbox {...args} size="sm" defaultChecked aria-label="sm" />
      <Checkbox {...args} size="md" defaultChecked aria-label="md" />
      <Checkbox {...args} size="lg" defaultChecked aria-label="lg" />
    </div>
  ),
};
