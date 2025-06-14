import { FC } from "react";
import { useColumnForm } from "./column-form.hook";
import { Modal, ModalProps } from "../base-modal";
import { t } from "i18next";
import { Input } from "@/atoms/input";
import styles from "./column-modal.module.scss";

interface ColumnFormModalProps extends ModalProps {
  formik: ReturnType<typeof useColumnForm>;
  isLoading: boolean;
  confirmLabel?: string;
  onCloseModal: () => void;
}

export const ColumnFormModal: FC<ColumnFormModalProps> = ({
  title,
  formik,
  isLoading,
  confirmLabel,
  onCloseModal,
  ...props
}) => {
  return (
    <Modal
      title={title}
      loading={isLoading}
      confirmButton={{
        onClick: () => {
          formik.submitForm();
        },
        label: confirmLabel
      }}
      cancelButton={{
        onClick: onCloseModal
      }}
      onClose={onCloseModal}
      {...props}
    >
      <form className={styles.columnModal} onSubmit={formik.handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder={t("components.molecules.modals.createColumn.form.fields.name.placeholder")}
          label={t("components.molecules.modals.createColumn.form.fields.name.label")}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.name && formik.errors.name ? t(formik.errors.name as any) : undefined
          }
        />
        {/* TODO: add color input */}
      </form>
    </Modal>
  );
};
