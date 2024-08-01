import type { Meta, StoryObj } from "@storybook/react";
import { BoardList } from "./board-list";

const meta: Meta<typeof BoardList> = {
  title: "Molecules/BoardList",
  component: BoardList,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof BoardList>;

export const Normal: Story = {
  args: {
    boards: [
      {
        id: "1",
        name: "Board 1"
      },
      {
        id: "2",
        name: "Board 1"
      },
      {
        id: "3",
        name: "Board 1"
      }
    ],
    activeBoardId: "1"
  }
};
