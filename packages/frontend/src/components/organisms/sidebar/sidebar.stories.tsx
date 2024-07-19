import type { Meta, StoryObj } from "@storybook/react";

import { Sidebar } from "./sidebar";
import {
  RiHomeFill,
  RiHomeLine,
  RiLogoutBoxLine,
  RiSettingsFill,
  RiSettingsLine
} from "@remixicon/react";

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
        type: "anchor",
        path: "/",
        label: "Home",
        icon: (isActive) => (isActive ? <RiHomeFill /> : <RiHomeLine />)
      },
      {
        type: "anchor",
        path: "/about",
        label: "About",
        icon: (isActive) => (isActive ? <RiSettingsFill /> : <RiSettingsLine />)
      }
    ],
    actionLinks: [
      {
        type: "action",
        label: "About",
        onClick: () => {},
        icon: () => <RiLogoutBoxLine />
      }
    ]
  }
};
