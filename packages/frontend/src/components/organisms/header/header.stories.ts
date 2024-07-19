import type { Meta, StoryObj } from "@storybook/react";

import { Header } from "./header";

const meta: Meta<typeof Header> = {
  title: "Organisms/Header",
  component: Header,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Normal: Story = {
  args: {
    navLinks: [
      {
        type: "anchor",
        path: "/",
        label: "Home"
      },
      {
        type: "anchor",
        path: "/about",
        label: "About"
      }
    ]
  }
};
