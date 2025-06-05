import type { Meta, StoryObj } from "@storybook/react";
import { RiBook2Fill } from "@remixicon/react";
import { Tag } from "./tag";

const meta: Meta<typeof Tag> = {
  title: "Atoms/Tag",
  component: Tag,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    icon: <RiBook2Fill />,
    label: "Learning"
  }
};
