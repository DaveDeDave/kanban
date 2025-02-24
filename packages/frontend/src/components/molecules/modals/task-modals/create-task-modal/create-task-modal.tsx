import { FC, useMemo } from "react";
import { t } from "i18next";
import { ModalProps } from "../../base-modal";
import { useCreateTask } from "@/hooks/trpc/task/createTask.hook";
import { useTaskForm } from "../task-form.hook";
import { TaskFormModal } from "../task-form-modal.component";

export interface CreateTaskModalProps extends ModalProps {
  columnId?: string;
}

export const CreateTaskModal: FC<CreateTaskModalProps> = ({ columnId, onClose, ...props }) => {
  const createTask = useCreateTask();

  const onCloseModal = () => {
    onClose?.();
  };

  const formik = useTaskForm(async ({ title, description }) => {
    await createTask.mutateAsync({
      title,
      description,
      columnId: columnId!
    });
    onCloseModal();
  });

  const isConfirmDisabled = useMemo(() => {
    const hasErrors = Object.keys(formik.errors).length > 0;
    const isTouched = Object.values(formik.touched).find((touched) => touched === true);

    return Boolean(!isTouched || hasErrors);
  }, [formik.errors, formik.touched]);

  return (
    <TaskFormModal
      title={t("components.molecules.modals.createTask.title")}
      description={t("components.molecules.modals.createTask.description")}
      isLoading={createTask.isLoading}
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
