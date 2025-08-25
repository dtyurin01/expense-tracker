import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RadioGroup, Radio } from "./Radio";

const meta = {
  title: "UI/Radio",
  component: Radio,
  args: {
    size: "md",
    disabled: false,
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Group: Story = {
  render: (args) => (
    <RadioGroup defaultValue="a" className="flex flex-col gap-3">
      <label className="inline-flex items-center gap-2">
        <Radio {...args} value="a" />
        <span>Option A</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <Radio {...args} value="b" />
        <span>Option B</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <Radio {...args} value="c" />
        <span>Option C</span>
      </label>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <RadioGroup defaultValue="a" className="flex flex-col gap-3">
      <label className="inline-flex items-center gap-2">
        <Radio {...args} value="a" />
        <span>Option A</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <Radio {...args} value="b" />
        <span>Option B</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <Radio {...args} value="c" />
        <span>Option C</span>
      </label>
    </RadioGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 text-sm opacity-70">xs</div>
        <RadioGroup defaultValue="a" className="flex items-center gap-4">
          <Radio value="a" size="xs" />
          <Radio value="b" size="xs" />
          <Radio value="c" size="xs" />
        </RadioGroup>
      </div>
      <div>
        <div className="mb-2 text-sm opacity-70">sm</div>
        <RadioGroup defaultValue="a" className="flex items-center gap-4">
          <Radio value="a" size="sm" />
          <Radio value="b" size="sm" />
          <Radio value="c" size="sm" />
        </RadioGroup>
      </div>
      <div>
        <div className="mb-2 text-sm opacity-70">md</div>
        <RadioGroup defaultValue="a" className="flex items-center gap-4">
          <Radio value="a" size="md" />
          <Radio value="b" size="md" />
          <Radio value="c" size="md" />
        </RadioGroup>
      </div>
      <div>
        <div className="mb-2 text-sm opacity-70">lg</div>
        <RadioGroup defaultValue="a" className="flex items-center gap-4">
          <Radio value="a" size="lg" />
          <Radio value="b" size="lg" />
          <Radio value="c" size="lg" />
        </RadioGroup>
      </div>
    </div>
  ),
};
