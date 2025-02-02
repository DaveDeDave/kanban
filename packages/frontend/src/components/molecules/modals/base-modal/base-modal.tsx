import { FC } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./base-modal.module.scss";
import { Heading } from "@/atoms/typography/heading";
import { IconButton } from "@/atoms/icon-button";
import { RiCloseLine } from "@remixicon/react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@/atoms/button";
import { t } from "i18next";

interface ModalButton {
  onClick?: () => void;
  label?: string;
}

export interface ModalProps extends Dialog.DialogProps {
  title?: string;
  description?: string;
  closable?: boolean;
  maskClosable?: boolean;
  confirmButton?: ModalButton;
  cancelButton?: ModalButton;
  loading?: boolean;
  onClose?: () => void;
}

export const Modal: FC<ModalProps> = ({
  title,
  description,
  closable = true,
  maskClosable = true,
  confirmButton,
  cancelButton,
  loading,
  onClose,
  children,
  ...props
}) => {
  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={styles.modalOverlay}
          onClick={maskClosable && !loading ? onClose : undefined}
        >
          <Dialog.Content
            className={styles.modalContent}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div className={styles.heading}>
              <VisuallyHidden.Root asChild>
                <Dialog.Title></Dialog.Title>
              </VisuallyHidden.Root>
              <Heading withoutMargins size={4}>
                {title}
              </Heading>
              {closable ? (
                <Dialog.Close asChild>
                  <IconButton
                    icon={<RiCloseLine />}
                    onClick={onClose}
                    aria-label={t("general.modal.closeModal")}
                    disabled={loading}
                  />
                </Dialog.Close>
              ) : null}
            </div>
            <div className={styles.content}>
              <VisuallyHidden.Root asChild>
                <Dialog.Description>{description}</Dialog.Description>
              </VisuallyHidden.Root>
              {children}
            </div>
            <div className={styles.footer}>
              {cancelButton ? (
                <Button
                  variant="secondary"
                  label={cancelButton.label ?? t("general.modal.cancelButtonLabel")}
                  onClick={cancelButton.onClick ?? onClose}
                  disabled={loading}
                />
              ) : null}
              {confirmButton ? (
                <Button
                  label={confirmButton.label ?? t("general.modal.confirmButtonLabel")}
                  onClick={confirmButton.onClick}
                  disabled={loading}
                />
              ) : null}
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
