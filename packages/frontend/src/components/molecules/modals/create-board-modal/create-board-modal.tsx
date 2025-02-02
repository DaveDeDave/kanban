import { FC } from "react";
import { Modal, ModalProps } from "../base-modal";
import { t } from "i18next";
import { Input } from "@/atoms/input";
import styles from "./create-board-modal.module.scss";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { useCreateBoard } from "@/hooks/trpc/board/createBoard.hook";

export const CreateBoardModal: FC<ModalProps> = ({ onClose, ...props }) => {
  const createBoard = useCreateBoard();

  const onCloseModal = () => {
    formik.resetForm();
    onClose?.();
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: ""
    },
    validationSchema: toFormikValidationSchema(
      z.object({
        name: z.string({
          required_error: "components.molecules.modals.createBoard.form.fields.name.errors.required"
        }),
        description: z.string({
          required_error:
            "components.molecules.modals.createBoard.form.fields.description.errors.required"
        })
      })
    ),
    onSubmit: async ({ name, description }) => {
      await createBoard.mutateAsync({
        name,
        description
      });
      onCloseModal();
    }
  });

  return (
    <Modal
      title={t("components.molecules.modals.createBoard.title")}
      loading={createBoard.isLoading}
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
      <form className={styles.createBoardForm} onSubmit={formik.handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder={t("components.molecules.modals.createBoard.form.fields.name.placeholder")}
          label={t("components.molecules.modals.createBoard.form.fields.name.label")}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.name && formik.errors.name ? t(formik.errors.name as any) : undefined
          }
        />
        <Input
          type="text"
          name="description"
          placeholder={t(
            "components.molecules.modals.createBoard.form.fields.description.placeholder"
          )}
          label={t("components.molecules.modals.createBoard.form.fields.description.label")}
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
