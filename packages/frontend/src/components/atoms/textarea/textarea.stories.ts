import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { TextArea } from "./textarea";

const meta: Meta<typeof TextArea> = {
  title: "Atoms/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: { onClick: fn() }
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: {
    label: "TextArea",
    placeholder: "Write something"
  }
};

export const Error: Story = {
  args: {
    label: "Description",
    placeholder: "Enter the description",
    value: "",
    error: "Write something"
  }
};

export const Disabled: Story = {
  args: {
    label: "Description",
    placeholder: "Enter the description",
    disabled: true
  }
};
