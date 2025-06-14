import { FC, useEffect, useMemo, useState } from "react";
import { t } from "i18next";
import { ModalProps } from "../../base-modal";
import { useBoardForm } from "../board-form.hook";
import { BoardFormModal } from "../board-form-modal.component";
import { useUpdateBoard } from "@/hooks/trpc/board/updateBoard.hook";
import { Trans } from "react-i18next";
import { Text } from "@/atoms/typography/text";

export interface UpdateBoardModalProps extends ModalProps {
  boardId?: string;
  defaultValues?: {
    name: string;
    description: string;
  };
}

export const UpdateBoardModal: FC<UpdateBoardModalProps> = ({
  boardId,
  defaultValues,
  open,
  onClose,
  ...props
}) => {
  const [name, setName] = useState("");
  const updateBoard = useUpdateBoard();

  const onCloseModal = () => {
    onClose?.();
  };

  const formik = useBoardForm(async ({ name, description }) => {
    await updateBoard.mutateAsync({
      boardId: boardId!,
      name,
      description
    });
    onCloseModal();
  });

  useEffect(() => {
    if (open) {
      formik.setValues({
        name: defaultValues?.name ?? "",
        description: defaultValues?.description ?? ""
      });
    }
  }, [open, defaultValues]);

  useEffect(() => {
    if (!defaultValues?.name) {
      return;
    }

    setName(defaultValues.name);
  }, [defaultValues?.name]);

  const isConfirmDisabled = useMemo(() => {
    const hasErrors = Object.keys(formik.errors).length > 0;
    // const isTouched = Object.values(formik.touched).find((touched) => touched === true);

    return Boolean(hasErrors);
  }, [formik.errors, formik.touched]);

  return (
    <BoardFormModal
      title={t("components.molecules.modals.updateBoard.title")}
      description={
        <Trans
          i18nKey="components.molecules.modals.updateBoard.description"
          components={{ bold: <Text weight={500} type="label" /> }}
          values={{
            name
          }}
        />
      }
      isLoading={updateBoard.isLoading}
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
