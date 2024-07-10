import type { Meta, StoryObj } from "@storybook/react";

import { Sidebar } from "./sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Organisms/Sidebar",
  component: Sidebar,
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
type Story = StoryObj<typeof Sidebar>;

export const Normal: Story = {
  args: {
    navLinks: [
      {
        path: "/",
        label: "Home"
      },
      {
        path: "/about",
        label: "About"
      }
    ]
  }
};
