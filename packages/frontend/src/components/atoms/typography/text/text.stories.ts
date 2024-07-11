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

export const ParagraphMedium: Story = {
  args: {
    type: "paragraph",
    size: "md",
    weight: 400,
    children: "text"
  }
};

export const ParagraphLarge: Story = {
  args: {
    type: "paragraph",
    size: "lg",
    weight: 400,
    children: "text"
  }
};

export const ParagraphSmall: Story = {
  args: {
    type: "paragraph",
    size: "sm",
    weight: 400,
    children: "text"
  }
};

export const LabelhMedium: Story = {
  args: {
    type: "label",
    size: "md",
    weight: 400,
    children: "text"
  }
};

export const LabelLarge: Story = {
  args: {
    type: "label",
    size: "lg",
    weight: 400,
    children: "text"
  }
};

export const LabelSmall: Story = {
  args: {
    type: "label",
    size: "sm",
    weight: 400,
    children: "text"
  }
};
