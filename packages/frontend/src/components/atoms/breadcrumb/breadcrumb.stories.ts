import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Atoms/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    links: [
      {
        label: "Boards",
        pathname: "/app/boards"
      },
      {
        label: "Test board"
      }
    ]
  }
};

export const ManyLinks: Story = {
  args: {
    links: [
      {
        label: "Settings",
        pathname: "/app/settings"
      },
      {
        label: "Notifications",
        pathname: "/app/settings/Notifications"
      },
      {
        label: "Email notifications"
      }
    ]
  }
};

export const OneLink: Story = {
  args: {
    links: [
      {
        label: "Boards"
      }
    ]
  }
};
