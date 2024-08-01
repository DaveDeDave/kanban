import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { BoardListElement } from "./board-list-element";

const meta: Meta<typeof BoardListElement> = {
  title: "Atoms/BoardListElement",
  component: BoardListElement,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: { onClick: fn() }
};

export default meta;
type Story = StoryObj<typeof BoardListElement>;

export const Normal: Story = {
  args: {
    name: "Board 1"
  }
};

export const Active: Story = {
  args: {
    name: "Board 1",
    isActive: true
  }
};
