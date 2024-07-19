import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./text";

const meta: Meta<typeof Text> = {
  title: "Atoms/Text",
  component: Text,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Paragraph: Story = {
  args: {
    type: "paragraph",
    size: "md",
    weight: 400,
    children: "text"
  }
};

export const Label: Story = {
  args: {
    type: "label",
    size: "md",
    weight: 400,
    children: "text"
  }
};

export const Link: Story = {
  args: {
    type: "link",
    size: "md",
    weight: 400,
    children: "text"
  }
};
