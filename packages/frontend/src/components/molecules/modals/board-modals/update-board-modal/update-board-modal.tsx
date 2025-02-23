import { FC, useEffect, useMemo } from "react";
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

  const isConfirmDisabled = useMemo(() => {
    const hasErrors = Object.keys(formik.errors).length > 0;
    // const isTouched = Object.values(formik.touched).find((touched) => touched === true);

    return Boolean(hasErrors);
  }, [formik.errors, formik.touched]);

  return (
    <BoardFormModal
      title={t("components.molecules.modals.editBoard.title")}
      description={t("components.molecules.modals.editBoard.description")}
      isLoading={updateBoard.isLoading}
      disabled={isConfirmDisabled}
      formik={formik}
      open={open}
      onCloseModal={onCloseModal}
      afterClose={() => {
        formik.resetForm();
      }}
      {...props}
    />
  );
};
