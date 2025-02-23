import type { Meta, StoryObj } from "@storybook/react";
import { KanbanColumn } from "./kanban-column";
import { fn } from "@storybook/test";

const meta: Meta<typeof KanbanColumn> = {
  title: "Organisms/KanbanColumn",
  component: KanbanColumn,
  tags: ["autodocs"],
  args: {
    onEdit: fn(),
    onDelete: fn(),
    onAddTask: fn(),
    onEditTask: fn(),
    onDeleteTask: fn()
  }
};

export default meta;
type Story = StoryObj<typeof KanbanColumn>;

const mockTasks = [
  {
    id: "1",
    title: "Write docs",
    description: "Write documentation",
    onEdit: () => {},
    onDelete: () => {}
  },
  {
    id: "2",
    title: "Fix bug",
    description: "Fix the reported bug",
    onEdit: () => {},
    onDelete: () => {}
  },
  {
    id: "3",
    title: "Answer email",
    description: "Answer the new email",
    onEdit: () => {},
    onDelete: () => {}
  }
];

export const Normal: Story = {
  args: {
    head: {
      title: "To do",
      color: "#A22C29"
    },
    tasks: mockTasks
  }
};
