import type { Meta, StoryObj } from "@storybook/react";
import { TaskCard } from "./task-card";

const meta: Meta<typeof TaskCard> = {
  title: "Molecules/TaskCard",
  component: TaskCard,
  tags: ["autodocs"],
  args: {}
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

export const Normal: Story = {
  args: {
    title: "Task",
    description: "Task description"
  }
};
