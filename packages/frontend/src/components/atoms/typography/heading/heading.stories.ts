import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "./heading";

const meta: Meta<typeof Heading> = {
  title: "Atoms/Heading",
  component: Heading,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const H1: Story = {
  args: {
    size: 1,
    children: "Title"
  }
};

export const H2: Story = {
  args: {
    size: 2,
    children: "Title"
  }
};

export const H3: Story = {
  args: {
    size: 3,
    children: "Title"
  }
};

export const H4: Story = {
  args: {
    size: 4,
    children: "Title"
  }
};

export const H5: Story = {
  args: {
    size: 5,
    children: "Title"
  }
};

export const H6: Story = {
  args: {
    size: 6,
    children: "Title"
  }
};
