import type { Meta, StoryObj } from "@storybook/react";

import { SidebarNavLink } from "./sidebar-nav-link";
import { RiHomeFill, RiHomeLine, RiSettingsFill, RiSettingsLine } from "@remixicon/react";

const meta: Meta<typeof SidebarNavLink> = {
  title: "Atoms/SidebarNavLink",
  component: SidebarNavLink,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof SidebarNavLink>;

export const Normal: Story = {
  args: {
    path: "/about",
    label: "About",
    icon: (isActive) => (isActive ? <RiHomeFill /> : <RiHomeLine />)
  }
};

export const Active: Story = {
  args: {
    path: "/",
    label: "Home",
    icon: (isActive) => (isActive ? <RiSettingsFill /> : <RiSettingsLine />)
  }
};
