import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Modal } from "./base-modal";

const meta: Meta<typeof Modal> = {
  title: "Molecules/Modal",
  component: Modal,
  tags: ["autodocs"],
  args: { onClose: fn() }
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    open: true,
    title: "Modal",
    children: "Modal content",
    confirmButton: {
      onClick: () => {}
    },
    cancelButton: {
      onClick: () => {}
    }
  }
};

export const Loading: Story = {
  args: {
    open: true,
    title: "Modal",
    children: "Modal content",
    loading: true,
    confirmButton: {
      onClick: () => {}
    },
    cancelButton: {
      onClick: () => {}
    }
  }
};
