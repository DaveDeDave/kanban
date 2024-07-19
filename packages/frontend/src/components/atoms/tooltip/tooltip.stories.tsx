import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Normal: Story = {
  args: {
    variant: "primary",
    children: <p>Move your mouse here to show the tooltip!</p>,
    content: "This is a tooltip!"
  }
};

export const WithoutArrow: Story = {
  args: {
    variant: "primary",
    children: <p>Move your mouse here to show the tooltip!</p>,
    content: "This is a tooltip!",
    showArrow: false
  }
};

export const Open: Story = {
  args: {
    variant: "primary",
    children: <p>Move your mouse here to show the tooltip!</p>,
    content: "This is a tooltip!",
    open: true
  }
};
