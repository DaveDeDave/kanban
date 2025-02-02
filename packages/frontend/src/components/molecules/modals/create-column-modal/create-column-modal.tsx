import { FC } from "react";
import { Modal, ModalProps } from "../base-modal";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { t } from "i18next";
import styles from "./create-column-modal.module.scss";
import { Input } from "@/atoms/input";
import { useCreateColumn } from "@/hooks/trpc/column/createColumn.hook";

export interface CreateColumnModalProps extends ModalProps {
  boardId?: string;
}

export const CreateColumnModal: FC<CreateColumnModalProps> = ({ boardId, onClose, ...props }) => {
  const createColumn = useCreateColumn();

  const onCloseModal = () => {
    formik.resetForm();
    onClose?.();
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      color: ""
    },
    validationSchema: toFormikValidationSchema(
      z.object({
        name: z.string({
          required_error:
            "components.molecules.modals.createColumn.form.fields.name.errors.required"
        })
        // color: z.string({
        //   required_error:
        //     "components.molecules.modals.createColumn.form.fields.color.errors.required"
        // })
      })
    ),
    onSubmit: ({ name }) => {
      createColumn.mutateAsync({
        name,
        // TODO: take value from color input
        color: "#5a2bff",
        boardId: boardId!
      });
      onCloseModal();
    }
  });

  return (
    <Modal
      title={t("components.molecules.modals.createColumn.title")}
      loading={createColumn.isLoading}
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
      <form className={styles.createColumnForm} onSubmit={formik.handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder={t("components.molecules.modals.createColumn.form.fields.name.placeholder")}
          label={t("components.molecules.modals.createColumn.form.fields.name.label")}
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
