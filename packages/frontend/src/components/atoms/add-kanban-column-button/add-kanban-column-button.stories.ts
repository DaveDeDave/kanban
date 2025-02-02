import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { AddColumnButton } from "./add-kanban-column-button";

const meta: Meta<typeof AddColumnButton> = {
  title: "Atoms/AddKanbanColumnButton",
  component: AddColumnButton,
  tags: ["autodocs"],
  args: { onClick: fn() }
};

export default meta;
type Story = StoryObj<typeof AddColumnButton>;

export const Default: Story = {
  args: {}
};
