import { FC } from "react";
import { Modal, ModalProps } from "../../base-modal";
import { useDeleteBoard } from "@/hooks/trpc/board/deleteBoard.hook";
import { Text } from "@/atoms/typography/text";
import { t } from "i18next";

export interface DeleteBoardModalProps extends ModalProps {
  boardId?: string;
}

export const DeleteBoardModal: FC<DeleteBoardModalProps> = ({ boardId, onClose, ...props }) => {
  const deleteBoard = useDeleteBoard();

  return (
    <Modal
      title={t("components.molecules.modals.deleteBoard.title")}
      loading={deleteBoard.isLoading}
      confirmButton={{
        onClick: () => {
          deleteBoard.mutateAsync({
            boardId: boardId!
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
