import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { RiAddBoxLine } from "@remixicon/react";
import { IconButton } from "./icon-button";

const meta: Meta<typeof IconButton> = {
  title: "Atoms/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: { onClick: fn() }
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {
  args: {
    variant: "primary",
    icon: <RiAddBoxLine />
  }
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    icon: <RiAddBoxLine />
  }
};
