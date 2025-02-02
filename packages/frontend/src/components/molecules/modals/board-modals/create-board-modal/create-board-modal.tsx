import { FC } from "react";
import { t } from "i18next";
import { ModalProps } from "../../base-modal";
import { useCreateBoard } from "@/hooks/trpc/board/createBoard.hook";
import { useBoardForm } from "../board-form.hook";
import { BoardFormModal } from "../board-form-modal.component";

export const CreateBoardModal: FC<ModalProps> = ({ onClose, ...props }) => {
  const createBoard = useCreateBoard();

  const onCloseModal = () => {
    formik.resetForm();
    onClose?.();
  };

  const formik = useBoardForm(async ({ name, description }) => {
    await createBoard.mutateAsync({
      name,
      description
    });
    onCloseModal();
  });

  return (
    <BoardFormModal
      title={t("components.molecules.modals.createColumn.title")}
      isLoading={createBoard.isLoading}
      formik={formik}
      onCloseModal={onCloseModal}
      {...props}
    />
  );
};
