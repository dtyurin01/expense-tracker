import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input, InputSplit } from "./Input";
import { FiSearch, FiX, FiTag } from "react-icons/fi";

const meta = {
  title: "UI/Input",
  component: Input,
  args: {
    label: "Input label",
    placeholder: "Content",
    size: "md",
    radius: "lg",
    block: false,
    status: "default",
    disabled: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    radius: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
    },
    status: {
      control: "select",
      options: ["default", "success", "warning", "error", "info"],
    },
    block: { control: "boolean" },
    disabled: { control: "boolean" },
    type: {
      control: "select",
      options: ["text", "email", "password", "number"],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcons: Story = {
  args: {
    leftIcon: <FiSearch />,
    rightIcon: <FiX />,
    placeholder: "Search…",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "••••••••",
    rightIcon: <FiX />,
  },
};

export const Error: Story = {
  args: {
    status: "error",
    errorText: "Invalid value",
  },
};

export const Success: Story = {
  args: {
    status: "success",
    hint: "It's okay!",
    defaultValue: "Validated",
  },
};

export const Block: Story = {
  args: {
    block: true,
    placeholder: "Full width",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "Disabled",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 w-full max-w-xl">
      <Input {...args} size="xs" label="XS" placeholder="Content" />
      <Input {...args} size="sm" label="SM" placeholder="Content" />
      <Input {...args} size="md" label="MD" placeholder="Content" />
      <Input {...args} size="lg" label="LG" placeholder="Content" />
    </div>
  ),
};

export const Split: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <InputSplit
        label="Input label"
        placeholder="Content"
        rightSlot={<span className="text-sm">Label</span>}
        block
      />
      <InputSplit
        label="With icon label"
        placeholder="Content"
        rightSlot={
          <span className="inline-flex items-center gap-2">
            <FiTag />
            <span className="text-sm">Label</span>
          </span>
        }
        block
      />
    </div>
  ),
};

export const SplitSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-xl">
      <InputSplit
        label="XS"
        size="xs"
        placeholder="Content"
        rightSlot={<span className="text-sm">Label</span>}
        block
      />
      <InputSplit
        label="SM"
        size="sm"
        placeholder="Content"
        rightSlot={<span className="text-sm">Label</span>}
        block
      />
      <InputSplit
        label="MD"
        size="md"
        placeholder="Content"
        rightSlot={<span className="text-sm">Label</span>}
        block
      />
      <InputSplit
        label="LG"
        size="lg"
        placeholder="Content"
        rightSlot={<span className="text-sm">Label</span>}
        block
      />
    </div>
  ),
};
