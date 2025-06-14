import { FC, useEffect, useState } from "react";
import { Modal, ModalProps } from "../../base-modal";
import { useDeleteBoard } from "@/hooks/trpc/board/deleteBoard.hook";
import { Text } from "@/atoms/typography/text";
import { t } from "i18next";
import { Trans } from "react-i18next";

export interface DeleteBoardModalProps extends ModalProps {
  boardId?: string;
  boardName?: string;
}

export const DeleteBoardModal: FC<DeleteBoardModalProps> = ({
  boardId,
  boardName,
  onClose,
  ...props
}) => {
  const [name, setName] = useState("");
  const deleteBoard = useDeleteBoard();

  useEffect(() => {
    if (!boardName) {
      return;
    }

    setName(boardName);
  }, [boardName]);

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
      <Text>
        <Trans
          i18nKey="components.molecules.modals.deleteBoard.description"
          components={{ bold: <Text weight={500} type="label" /> }}
          values={{
            name
          }}
        />
      </Text>
    </Modal>
  );
};
