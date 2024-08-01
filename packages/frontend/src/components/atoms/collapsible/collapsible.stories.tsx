import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Collapsible } from "./collapsible";

const meta: Meta<typeof Collapsible> = {
  title: "Atoms/Collapsible",
  component: Collapsible,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: { onClick: fn() }
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Normal: Story = {
  args: {
    title: "All boards",
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span>Board 1</span>
        <span>Board 2</span>
        <span>Board 3</span>
      </div>
    )
  }
};
