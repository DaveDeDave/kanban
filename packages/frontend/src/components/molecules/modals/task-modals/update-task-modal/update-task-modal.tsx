import { FC, useEffect, useMemo } from "react";
import { t } from "i18next";
import { ModalProps } from "../../base-modal";
import { useUpdateTask } from "@/hooks/trpc/task/updateTask.hook";
import { useTaskForm } from "../task-form.hook";
import { TaskFormModal } from "../task-form-modal.component";

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

  const isConfirmDisabled = useMemo(() => {
    const hasErrors = Object.keys(formik.errors).length > 0;
    // const isTouched = Object.values(formik.touched).find((touched) => touched === true);

    return Boolean(hasErrors);
  }, [formik.errors, formik.touched]);

  return (
    <TaskFormModal
      title={t("components.molecules.modals.editTask.title")}
      description={t("components.molecules.modals.editTask.description")}
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
