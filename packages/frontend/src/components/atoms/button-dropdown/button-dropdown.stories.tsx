import type { Meta, StoryObj } from "@storybook/react";
import { RiDeleteBin2Line, RiMoreFill, RiPencilLine } from "@remixicon/react";
import { ButtonDropdown } from "./button-dropdown";

const meta: Meta<typeof ButtonDropdown> = {
  title: "Atoms/ButtonDropdown",
  component: ButtonDropdown,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ButtonDropdown>;

export const Default: Story = {
  args: {
    dropdown: {
      align: "end",
      items: [
        {
          label: "Edit",
          onClick: () => {},
          icon: <RiPencilLine />
        },
        {
          label: "Delete",
          onClick: () => {},
          icon: <RiDeleteBin2Line />
        }
      ]
    },
    icon: <RiMoreFill />
  }
};
