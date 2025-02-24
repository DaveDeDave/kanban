import { FC } from "react";
import { Modal, ModalProps } from "../../base-modal";
import { Text } from "@/atoms/typography/text";
import { t } from "i18next";
import { useDeleteTask } from "@/hooks/trpc/task/deleteTask.hook";

export interface DeleteTaskModalProps extends ModalProps {
  taskId?: string;
}

export const DeleteTaskModal: FC<DeleteTaskModalProps> = ({ taskId, onClose, ...props }) => {
  const deleteTask = useDeleteTask();

  return (
    <Modal
      title={t("components.molecules.modals.deleteTask.title")}
      loading={deleteTask.isLoading}
      confirmButton={{
        onClick: () => {
          deleteTask.mutateAsync({
            taskId: taskId!
          });
          onClose?.();
        }
      }}
      cancelButton={{}}
      onClose={onClose}
      {...props}
    >
      <Text>{t("components.molecules.modals.deleteTask.description")}</Text>
    </Modal>
  );
};
