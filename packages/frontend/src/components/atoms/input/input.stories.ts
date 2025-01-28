import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: { onClick: fn() }
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Input",
    placeholder: "Write something"
  }
};

export const Password: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Password"
  }
};

export const Error: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    value: "mario.rossi@@gmail",
    error: "Email is in the wrong format"
  }
};

export const Disabled: Story = {
  args: {
    label: "Input",
    placeholder: "Write something",
    disabled: true
  }
};
