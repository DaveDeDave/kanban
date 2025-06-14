import { FC, useContext, useMemo, useState } from "react";
import { Modal, ModalProps } from "../base-modal";
import { useNavigate } from "@tanstack/react-router";
import { t } from "i18next";
import { AppContext } from "@/contexts/app.context";
import { Text } from "@/atoms/typography/text";
import { Trans } from "react-i18next";
import { Input } from "@/atoms/input";
import { useDeleteCurrentUser } from "@/hooks/trpc/user/delete-user.hook";

export interface DeleteAccountModalProps extends ModalProps {}

export const DeleteAccountModal: FC<DeleteAccountModalProps> = ({ onClose, ...props }) => {
  const appContext = useContext(AppContext);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const deleteCurrentUser = useDeleteCurrentUser();

  const handleSubmit = async () => {
    await deleteCurrentUser.mutateAsync();
    appContext?.logout();
    navigate({
      to: "/auth/login"
    });
  };

  const isSubmitDisabled = useMemo(() => {
    return email !== appContext?.user?.email;
  }, [email, appContext?.user?.email]);

  return (
    <Modal
      title={t("components.molecules.modals.deleteAccount.title")}
      confirmButton={{
        onClick: handleSubmit,
        label: t("general.label.delete")
      }}
      destructive
      cancelButton={{}}
      disabled={isSubmitDisabled}
      loading={deleteCurrentUser.isLoading}
      onClose={onClose}
      {...props}
    >
      <Text>{t("components.molecules.modals.deleteAccount.description-1")}</Text>
      <Text>
        <Trans
          i18nKey="components.molecules.modals.deleteAccount.description-2"
          components={{ bold: <Text weight={500} type="label" /> }}
          values={{
            email: appContext?.user?.email ?? ""
          }}
        />
      </Text>
      <Input
        placeholder={appContext?.user?.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </Modal>
  );
};
