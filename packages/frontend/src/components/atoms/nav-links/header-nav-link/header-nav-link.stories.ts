import type { Meta, StoryObj } from "@storybook/react";

import { HeaderNavLink } from "./header-nav-link";

const meta: Meta<typeof HeaderNavLink> = {
  title: "Atoms/HeaderNavLink",
  component: HeaderNavLink,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof HeaderNavLink>;

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
