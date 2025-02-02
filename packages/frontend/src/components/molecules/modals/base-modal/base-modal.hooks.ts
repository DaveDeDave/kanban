import { useState } from "react";

export interface useModalProps {}

export const useModal = (defaultOpen?: boolean) => {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    showModal,
    hideModal
  };
};
