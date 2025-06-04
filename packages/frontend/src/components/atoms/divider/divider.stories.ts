import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./divider";

const meta: Meta<typeof Divider> = {
  title: "Atoms/Divider",
  component: Divider,
  // parameters: {
  //   layout: "centered"
  // },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Dark: Story = {
  args: {
    variant: "dark"
  }
};

export const Light: Story = {
  args: {
    variant: "light"
  }
};
