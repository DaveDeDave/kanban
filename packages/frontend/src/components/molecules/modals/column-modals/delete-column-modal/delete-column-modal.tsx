import { FC, useEffect, useState } from "react";
import { Modal, ModalProps } from "../../base-modal";
import { Text } from "@/atoms/typography/text";
import { t } from "i18next";
import { useDeleteColumn } from "@/hooks/trpc/column/deleteColumn.hook";
import { Trans } from "react-i18next";

export interface DeleteColumnModalProps extends ModalProps {
  columnId?: string;
  columnName?: string;
}

export const DeleteColumnModal: FC<DeleteColumnModalProps> = ({
  columnId,
  columnName,
  onClose,
  ...props
}) => {
  const [name, setName] = useState("");
  const deleteColumn = useDeleteColumn();

  useEffect(() => {
    if (!columnName) {
      return;
    }

    setName(columnName);
  }, [columnName]);

  return (
    <Modal
      title={t("components.molecules.modals.deleteColumn.title")}
      loading={deleteColumn.isLoading}
      confirmButton={{
        onClick: () => {
          deleteColumn.mutateAsync({
            columnId: columnId!
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
          i18nKey="components.molecules.modals.deleteColumn.description"
          components={{ bold: <Text weight={500} type="label" /> }}
          values={{
            name
          }}
        />
      </Text>
    </Modal>
  );
};
