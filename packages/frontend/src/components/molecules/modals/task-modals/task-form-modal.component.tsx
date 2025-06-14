import { FC } from "react";
import { Modal, ModalProps } from "../base-modal";
import { t } from "i18next";
import { Input } from "@/atoms/input";
import styles from "./task-modal.module.scss";
import { TextArea } from "@/atoms/textarea";
import { useTaskForm } from "./task-form.hook";

interface TaskFormModalProps extends ModalProps {
  formik: ReturnType<typeof useTaskForm>;
  isLoading: boolean;
  confirmLabel?: string;
  onCloseModal: () => void;
}

export const TaskFormModal: FC<TaskFormModalProps> = ({
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
      <form className={styles.taskForm} onSubmit={formik.handleSubmit}>
        <Input
          type="text"
          name="title"
          placeholder={t("components.molecules.modals.createTask.form.fields.title.placeholder")}
          label={t("components.molecules.modals.createTask.form.fields.title.label")}
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.title && formik.errors.title ? t(formik.errors.title as any) : undefined
          }
        />
        <TextArea
          name="description"
          placeholder={t(
            "components.molecules.modals.createTask.form.fields.description.placeholder"
          )}
          label={t("components.molecules.modals.createTask.form.fields.description.label")}
          rows={3}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.description && formik.errors.description
              ? t(formik.errors.description as any)
              : undefined
          }
        />
      </form>
    </Modal>
  );
};
