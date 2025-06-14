import type { Meta, StoryObj } from "@storybook/react";
import { TaskCard } from "./task-card";
import { fn } from "@storybook/test";

const meta: Meta<typeof TaskCard> = {
  title: "Molecules/TaskCard",
  component: TaskCard,
  tags: ["autodocs"],
  args: { onUpdate: fn(), onDelete: fn() }
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

export const Normal: Story = {
  args: {
    title: "Task",
    description: "Task description"
  }
};
