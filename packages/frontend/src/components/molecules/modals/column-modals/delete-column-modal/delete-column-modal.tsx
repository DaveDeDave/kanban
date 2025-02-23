import { FC } from "react";
import { Modal, ModalProps } from "../../base-modal";
import { Text } from "@/atoms/typography/text";
import { t } from "i18next";
import { useDeleteColumn } from "@/hooks/trpc/column/deleteColumn.hook";

export interface DeleteColumnModalProps extends ModalProps {
  columnId?: string;
}

export const DeleteColumnModal: FC<DeleteColumnModalProps> = ({ columnId, onClose, ...props }) => {
  const deleteColumn = useDeleteColumn();

  return (
    <Modal
      title={t("components.molecules.modals.deleteBoard.title")}
      loading={deleteColumn.isLoading}
      confirmButton={{
        onClick: () => {
          deleteColumn.mutateAsync({
            columnId: columnId!
          });
          onClose?.();
        }
      }}
      cancelButton={{}}
      onClose={onClose}
      {...props}
    >
      <Text>{t("components.molecules.modals.deleteBoard.description")}</Text>
    </Modal>
  );
};
