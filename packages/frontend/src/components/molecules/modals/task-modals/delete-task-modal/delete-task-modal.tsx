import { FC, useEffect, useState } from "react";
import { Modal, ModalProps } from "../../base-modal";
import { Text } from "@/atoms/typography/text";
import { t } from "i18next";
import { useDeleteTask } from "@/hooks/trpc/task/deleteTask.hook";
import { Trans } from "react-i18next";

export interface DeleteTaskModalProps extends ModalProps {
  taskId?: string;
  taskTitle?: string;
}

export const DeleteTaskModal: FC<DeleteTaskModalProps> = ({
  taskId,
  taskTitle,
  onClose,
  ...props
}) => {
  const [title, setTitle] = useState("");
  const deleteTask = useDeleteTask();

  useEffect(() => {
    if (!taskTitle) {
      return;
    }

    setTitle(taskTitle);
  }, [taskTitle]);

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
        },
        label: t("general.label.delete")
      }}
      destructive
      cancelButton={{}}
      onClose={onClose}
      {...props}
    >
      <Text>
        <Trans
          i18nKey="components.molecules.modals.deleteTask.description"
          components={{ bold: <Text weight={500} type="label" /> }}
          values={{
            title
          }}
        />
      </Text>
    </Modal>
  );
};
