import type { Meta, StoryObj } from "@storybook/react";
import { RiAddLine, RiDeleteBin2Line, RiSettings2Fill } from "@remixicon/react";
import { Dropdown } from "./dropdown";
import { IconButton } from "../icon-button";

const meta: Meta<typeof Dropdown> = {
  title: "Atoms/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    items: [
      {
        icon: <RiAddLine />,
        label: "Add",
        onClick: () => {}
      },
      {
        icon: <RiDeleteBin2Line />,
        label: "Delete",
        onClick: () => {}
      }
    ],
    children: <IconButton variant="primary" icon={<RiSettings2Fill />} />
  }
};
