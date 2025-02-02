import { FC } from "react";
import { t } from "i18next";
import { useCreateColumn } from "@/hooks/trpc/column/createColumn.hook";
import { ModalProps } from "../../base-modal";
import { useColumnForm } from "../column-form.hook";
import { ColumnFormModal } from "../column-form-modal.component";

export interface CreateColumnModalProps extends ModalProps {
  boardId?: string;
}

export const CreateColumnModal: FC<CreateColumnModalProps> = ({ boardId, onClose, ...props }) => {
  const createColumn = useCreateColumn();

  const onCloseModal = () => {
    formik.resetForm();
    onClose?.();
  };

  const formik = useColumnForm(async ({ name }) => {
    await createColumn.mutateAsync({
      name,
      // TODO: take value from color input
      color: "#5a2bff",
      boardId: boardId!
    });
    onCloseModal();
  });

  return (
    <ColumnFormModal
      title={t("components.molecules.modals.createColumn.title")}
      isLoading={createColumn.isLoading}
      formik={formik}
      onCloseModal={onCloseModal}
      {...props}
    />
  );
};
