import { FC, useEffect } from "react";
import { t } from "i18next";
import { ModalProps } from "../../base-modal";
import { useBoardForm } from "../board-form.hook";
import { BoardFormModal } from "../board-form-modal.component";
import { useUpdateBoard } from "@/hooks/trpc/board/updateBoard.hook";

export interface UpdateBoardModalProps extends ModalProps {
  boardId?: string;
  defaultValues?: {
    name: string;
    description: string;
  };
}

export const UpdateBoardModal: FC<UpdateBoardModalProps> = ({
  boardId,
  defaultValues,
  open,
  onClose,
  ...props
}) => {
  const updateBoard = useUpdateBoard();

  const onCloseModal = () => {
    formik.resetForm();
    onClose?.();
  };

  const formik = useBoardForm(async ({ name, description }) => {
    await updateBoard.mutateAsync({
      boardId: boardId!,
      name,
      description
    });
    onCloseModal();
  });

  useEffect(() => {
    if (open) {
      formik.setValues({
        name: defaultValues?.name ?? "",
        description: defaultValues?.description ?? ""
      });
    }
  }, [open, defaultValues]);

  return (
    <BoardFormModal
      title={t("components.molecules.modals.editBoard.title")}
      isLoading={updateBoard.isLoading}
      formik={formik}
      open={open}
      onCloseModal={onCloseModal}
      {...props}
    />
  );
};
