import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";
import { BoardHeader } from "./board-header";

const meta: Meta<typeof BoardHeader> = {
  title: "Organisms/BoardHeader",
  component: BoardHeader,
  tags: ["autodocs"]
  // args: { onClick: fn() }
};

export default meta;
type Story = StoryObj<typeof BoardHeader>;

export const Normal: Story = {
  args: {
    name: "Board 1",
    description: "Board description is here"
  }
};
