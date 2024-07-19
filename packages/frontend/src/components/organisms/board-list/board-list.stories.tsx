import type { Meta, StoryObj } from "@storybook/react";
import { BoardList } from "./board-list";

const meta: Meta<typeof BoardList> = {
  title: "Organisms/BoardList",
  component: BoardList,
  decorators: [
    (Story) => (
      <div style={{ height: "90vh", display: "flex" }}>
        <Story />
      </div>
    )
  ],
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof BoardList>;

export const Normal: Story = {
  args: {
    boards: [
      {
        id: "0",
        name: "Board 1",
        ownerId: "0"
      },
      {
        id: "1",
        name: "Board 2",
        ownerId: "0"
      },
      {
        id: "2",
        name: "Board 3",
        ownerId: "0"
      }
    ]
  }
};
