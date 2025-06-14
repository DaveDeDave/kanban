import { FC, useContext } from "react";
import { Modal, ModalProps } from "../base-modal";
import { Text } from "@/atoms/typography/text";
import { t } from "i18next";
import { AppContext } from "@/contexts/app.context";
import { useNavigate } from "@tanstack/react-router";

export const LogoutModal: FC<ModalProps> = ({ onClose, ...props }) => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <Modal
      title={t("components.molecules.modals.logout.title")}
      confirmButton={{
        onClick: () => {
          appContext?.logout();
          navigate({
            to: "/auth/login"
          });
        },
        label: t("components.molecules.modals.logout.title")
      }}
      destructive
      cancelButton={{}}
      onClose={onClose}
      {...props}
    >
      <Text>{t("components.molecules.modals.logout.description")}</Text>
    </Modal>
  );
};
