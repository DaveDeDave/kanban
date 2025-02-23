import { FC, useMemo } from "react";
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

  const isConfirmDisabled = useMemo(() => {
    return Boolean(!formik.values.name);
    // const hasErrors = Object.keys(formik.errors).length > 0;
    // const isTouched = Object.values(formik.touched).find((touched) => touched === true);

    // return Boolean(!isTouched || hasErrors);
  }, [formik.errors, formik.touched, formik.values]);

  return (
    <ColumnFormModal
      title={t("components.molecules.modals.createColumn.title")}
      description={t("components.molecules.modals.createColumn.description")}
      isLoading={createColumn.isLoading}
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
