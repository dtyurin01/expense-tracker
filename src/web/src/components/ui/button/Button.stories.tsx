import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";
import {
  FiChevronRight,
  FiSettings,
  FiSearch,
  FiTrash2,
  FiAlertTriangle,
} from "react-icons/fi";
const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    radius: "lg",
    block: false,
    isLoading: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "link",
        "destructive",
        "success",
        "warning",
        "info",
        "iconDark",
        "iconTransparent",
      ],
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
    isLoading: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const WithIcon: Story = {
  args: {
    rightIcon: <FiChevronRight className="w-full h-full" />,
    children: "Next",
  },
};

export const IconOnlyDark: Story = {
  args: {
    variant: "iconDark",
    size: "icon",
    radius: "full",
    "aria-label": "Search",
    leftIcon: <FiSearch className="w-full h-full" />,
    children: undefined,
  },
};

export const IconOnlyTransparent: Story = {
  args: {
    variant: "iconTransparent",
    size: "icon",
    radius: "full",
    "aria-label": "Delete",
    leftIcon: <FiTrash2 className="w-full h-full" />,
    children: undefined,
  },
};

export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Destructive: Story = { args: { variant: "destructive" } };
export const Loading: Story = {
  args: { isLoading: true, children: "Saving..." },
};
export const Block: Story = { args: { block: true, children: "Full width" } };

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        {...args}
        size="xs"
        className="bg-brand"
        leftIcon={<FiSettings className="w-full h-full" />}
      >
        XS
      </Button>
      <Button
        {...args}
        size="sm"
        leftIcon={<FiSettings className="w-full h-full" />}
      >
        SM
      </Button>
      <Button
        {...args}
        size="md"
        leftIcon={<FiSettings className="w-full h-full" />}
      >
        MD
      </Button>
      <Button
        {...args}
        size="lg"
        leftIcon={<FiSettings className="w-full h-full" />}
      >
        LG
      </Button>
      <Button
        {...args}
        size="xl"
        leftIcon={<FiSettings className="w-full h-full" />}
      >
        XL
      </Button>

      <Button
        {...args}
        variant="iconDark"
        size="icon"
        radius="full"
        aria-label="Alert"
      >
        <FiAlertTriangle className="w-full h-full" />
      </Button>
      <Button
        {...args}
        variant="iconTransparent"
        size="icon"
        radius="full"
        aria-label="Settings"
      >
        <FiSettings className="w-full h-full" />
      </Button>

      <Button
        {...args}
        size="icon"
        aria-label="Settings"
        leftIcon={<FiSettings className="w-full h-full" />}
      />
    </div>
  ),
};
