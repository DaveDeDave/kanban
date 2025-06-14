import { FC, useEffect, useMemo, useState } from "react";
import { t } from "i18next";
import { ModalProps } from "../../base-modal";
import { useUpdateTask } from "@/hooks/trpc/task/updateTask.hook";
import { useTaskForm } from "../task-form.hook";
import { TaskFormModal } from "../task-form-modal.component";
import { Trans } from "react-i18next";
import { Text } from "@/atoms/typography/text";

export interface UpdateTaskModalProps extends ModalProps {
  taskId?: string;
  defaultValues?: {
    title: string;
    description: string;
  };
}

export const UpdateTaskModal: FC<UpdateTaskModalProps> = ({
  taskId,
  defaultValues,
  open,
  onClose,
  ...props
}) => {
  const [title, setTitle] = useState("");
  const updateTask = useUpdateTask();

  const onCloseModal = () => {
    onClose?.();
  };

  const formik = useTaskForm(async ({ title, description }) => {
    await updateTask.mutateAsync({
      title,
      description,
      taskId: taskId!
    });
    onCloseModal();
  });

  useEffect(() => {
    if (open) {
      formik.setValues({
        title: defaultValues?.title ?? "",
        description: defaultValues?.description ?? ""
      });
    }
  }, [open, defaultValues]);

  useEffect(() => {
    if (!defaultValues?.title) {
      return;
    }

    setTitle(defaultValues.title);
  }, [defaultValues?.title]);

  const isConfirmDisabled = useMemo(() => {
    const hasErrors = Object.keys(formik.errors).length > 0;
    // const isTouched = Object.values(formik.touched).find((touched) => touched === true);

    return Boolean(hasErrors);
  }, [formik.errors, formik.touched]);

  return (
    <TaskFormModal
      title={t("components.molecules.modals.updateTask.title")}
      description={
        <Trans
          i18nKey="components.molecules.modals.updateTask.description"
          components={{ bold: <Text weight={500} type="label" /> }}
          values={{
            title
          }}
        />
      }
      isLoading={updateTask.isLoading}
      disabled={isConfirmDisabled}
      formik={formik}
      open={open}
      onCloseModal={onCloseModal}
      afterClose={() => {
        formik.resetForm();
      }}
      {...props}
    />
  );
};
