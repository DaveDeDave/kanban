import { FC } from "react";
import { Modal, ModalProps } from "../base-modal";
import { t } from "i18next";
import { Input } from "@/atoms/input";
import styles from "./board-modal.module.scss";
import { useBoardForm } from "./board-form.hook";
import { TextArea } from "@/atoms/textarea";

interface BoardFormModalProps extends ModalProps {
  formik: ReturnType<typeof useBoardForm>;
  isLoading: boolean;
  onCloseModal: () => void;
}

export const BoardFormModal: FC<BoardFormModalProps> = ({
  title,
  formik,
  isLoading,
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
        }
      }}
      cancelButton={{
        onClick: onCloseModal
      }}
      onClose={onCloseModal}
      {...props}
    >
      <form className={styles.boardForm} onSubmit={formik.handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder={t("components.molecules.modals.createBoard.form.fields.name.placeholder")}
          label={t("components.molecules.modals.createBoard.form.fields.name.label")}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.name && formik.errors.name ? t(formik.errors.name as any) : undefined
          }
        />
        <TextArea
          name="description"
          placeholder={t(
            "components.molecules.modals.createBoard.form.fields.description.placeholder"
          )}
          label={t("components.molecules.modals.createBoard.form.fields.description.label")}
          value={formik.values.description}
          rows={3}
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
