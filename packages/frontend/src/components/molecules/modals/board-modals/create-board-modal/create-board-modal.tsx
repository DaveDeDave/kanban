import { FC, useMemo } from "react";
import { t } from "i18next";
import { ModalProps } from "../../base-modal";
import { useCreateBoard } from "@/hooks/trpc/board/createBoard.hook";
import { useBoardForm } from "../board-form.hook";
import { BoardFormModal } from "../board-form-modal.component";

export const CreateBoardModal: FC<ModalProps> = ({ onClose, ...props }) => {
  const createBoard = useCreateBoard();

  const onCloseModal = () => {
    onClose?.();
  };

  const formik = useBoardForm(async ({ name, description }) => {
    await createBoard.mutateAsync({
      name,
      description
    });
    onCloseModal();
  });

  const isConfirmDisabled = useMemo(() => {
    const hasErrors = Object.keys(formik.errors).length > 0;
    const isTouched = Object.values(formik.touched).find((touched) => touched === true);

    return Boolean(!isTouched || hasErrors);
  }, [formik.errors, formik.touched]);

  return (
    <BoardFormModal
      title={t("components.molecules.modals.createBoard.title")}
      description={t("components.molecules.modals.createBoard.description")}
      isLoading={createBoard.isLoading}
      disabled={isConfirmDisabled}
      formik={formik}
      onCloseModal={onCloseModal}
      afterClose={() => {
        formik.resetForm();
      }}
      {...props}
    />
  );
};
