import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { RiAddBoxLine } from "@remixicon/react";
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
    label: "Button",
    rounded: false,
    disabled: false,
    destructive: false
  }
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    label: "Button",
    rounded: false,
    disabled: false,
    destructive: false
  }
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    label: "Button",
    rounded: false,
    disabled: false,
    destructive: false
  }
};

export const Link: Story = {
  args: {
    variant: "link",
    label: "Button",
    rounded: false,
    disabled: false,
    destructive: false
  }
};

export const LeftIcon: Story = {
  args: {
    variant: "primary",
    label: "Button",
    leftIcon: <RiAddBoxLine />
  }
};

export const RightIcon: Story = {
  args: {
    variant: "primary",
    label: "Button",
    rightIcon: <RiAddBoxLine />
  }
};
