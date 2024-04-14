import type { Meta, StoryObj } from "@storybook/react";
import { RiAddCircleLine, RiSettings4Line } from "@remixicon/react";
import { ColumnHead } from "./column-head";

const meta: Meta<typeof ColumnHead> = {
  title: "Molecules/ColumnHead",
  component: ColumnHead,
  tags: ["autodocs"],
  args: {}
};

export default meta;
type Story = StoryObj<typeof ColumnHead>;

export const Normal: Story = {
  args: {
    title: "To do",
    numberOfTasks: 4
  }
};

export const WithActions: Story = {
  args: {
    title: "To do",
    numberOfTasks: 4,
    color: "#44CF6C",
    actions: [
      {
        onClick: () => {},
        icon: <RiSettings4Line />
      },
      {
        onClick: () => {},
        icon: <RiAddCircleLine />
      }
    ]
  }
};

export const ColorVariant: Story = {
  args: {
    title: "To do",
    numberOfTasks: 4,
    color: "#A22C29",
    actions: [
      {
        onClick: () => {},
        icon: <RiSettings4Line />
      },
      {
        onClick: () => {},
        icon: <RiAddCircleLine />
      }
    ]
  }
};
