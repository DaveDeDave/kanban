import { FC, useMemo } from "react";
import { Modal, ModalProps } from "../base-modal";
import { t } from "i18next";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import styles from "./create-task-modal.module.scss";
import { Input } from "@/atoms/input";
import { useCreateTask } from "@/hooks/trpc/task/createTask.hook";

export interface CreateTaskModalProps extends ModalProps {
  columnId?: string;
}

export const CreateTaskModal: FC<CreateTaskModalProps> = ({ columnId, onClose, ...props }) => {
  const createTask = useCreateTask();

  const onCloseModal = () => {
    formik.resetForm();
    onClose?.();
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: ""
    },
    validationSchema: toFormikValidationSchema(
      z.object({
        title: z.string({
          required_error: "components.molecules.modals.createTask.form.fields.title.errors.required"
        }),
        description: z.string({
          required_error:
            "components.molecules.modals.createTask.form.fields.description.errors.required"
        })
      })
    ),
    onSubmit: async ({ title, description }) => {
      await createTask.mutateAsync({
        title,
        description,
        columnId: columnId!
      });
      onCloseModal();
    }
  });

  const isConfirmDisabled = useMemo(() => {
    const hasErrors = Object.keys(formik.errors).length > 0;
    const isTouched = Object.values(formik.touched).find((touched) => touched === true);

    return Boolean(!isTouched || hasErrors);
  }, [formik.errors, formik.touched]);

  return (
    <Modal
      title={t("components.molecules.modals.createTask.title")}
      description={t("components.molecules.modals.createTask.description")}
      loading={createTask.isLoading}
      disabled={isConfirmDisabled}
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
      <form className={styles.createTaskForm} onSubmit={formik.handleSubmit}>
        <Input
          type="text"
          name="title"
          placeholder={t("components.molecules.modals.createTask.form.fields.title.placeholder")}
          label={t("components.molecules.modals.createTask.form.fields.title.label")}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.title && formik.errors.title ? t(formik.errors.title as any) : undefined
          }
        />
        <Input
          type="text"
          name="description"
          placeholder={t(
            "components.molecules.modals.createTask.form.fields.description.placeholder"
          )}
          label={t("components.molecules.modals.createTask.form.fields.description.label")}
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
