import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { BoardCard } from "./board-card";

const meta: Meta<typeof BoardCard> = {
  title: "Molecules/BoardCard",
  component: BoardCard,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: { onOpen: fn(), onEdit: fn(), onDelete: fn() }
};

export default meta;
type Story = StoryObj<typeof BoardCard>;

export const Default: Story = {
  args: {
    id: "1",
    title: "First board",
    description: "Just an example board for storybook"
  }
};

export const MaxLines: Story = {
  args: {
    id: "2",
    title: "First board",
    description:
      "Just an example board for storybook. Other text contained in the description. This is a very long description for testing. This is another sentence in the description."
  }
};
