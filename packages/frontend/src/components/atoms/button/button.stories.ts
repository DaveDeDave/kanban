import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: { onClick: fn() }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    label: "Button"
  }
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    label: "Button"
  }
};

export const LeftIcon: Story = {
  args: {
    variant: "primary",
    label: "Button",
    leftIcon: "x"
  }
};
