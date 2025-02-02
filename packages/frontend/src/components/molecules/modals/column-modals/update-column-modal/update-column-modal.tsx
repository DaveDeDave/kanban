import { FC, useEffect } from "react";
import { t } from "i18next";
import { ModalProps } from "../../base-modal";
import { useColumnForm } from "../column-form.hook";
import { ColumnFormModal } from "../column-form-modal.component";
import { useUpdateColumn } from "@/hooks/trpc/column/updateColumn.hook";

export interface UpdateColumnModalProps extends ModalProps {
  columnId?: string;
  defaultValues?: {
    name: string;
    color: string;
  };
}

export const UpdateColumnModal: FC<UpdateColumnModalProps> = ({
  columnId,
  defaultValues,
  open,
  onClose,
  ...props
}) => {
  const updateColumn = useUpdateColumn();

  const onCloseModal = () => {
    formik.resetForm();
    onClose?.();
  };

  const formik = useColumnForm(async ({ name }) => {
    await updateColumn.mutateAsync({
      name,
      // TODO: take value from color input
      // color: "#5a2bff",
      columnId: columnId!
    });
    onCloseModal();
  });

  useEffect(() => {
    if (open) {
      formik.setValues({
        name: defaultValues?.name ?? "",
        color: defaultValues?.color ?? ""
      });
    }
  }, [open, defaultValues]);

  return (
    <ColumnFormModal
      title={t("components.molecules.modals.editColumn.title")}
      isLoading={updateColumn.isLoading}
      formik={formik}
      open={open}
      onCloseModal={onCloseModal}
      {...props}
    />
  );
};
