import type { Meta, StoryObj } from "@storybook/react";

import { NavLink } from "./nav-link";

const meta: Meta<typeof NavLink> = {
  title: "Atoms/NavLink",
  component: NavLink,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof NavLink>;

export const Normal: Story = {
  args: {
    path: "/about",
    label: "About"
  }
};

export const Active: Story = {
  args: {
    path: "/",
    label: "Home"
  }
};
