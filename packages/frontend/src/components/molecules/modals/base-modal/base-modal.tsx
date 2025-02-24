import { FC, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./base-modal.module.scss";
import { Heading } from "@/atoms/typography/heading";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@/atoms/button";
import { t } from "i18next";
import { Text } from "@/atoms/typography/text";
import classNames from "classnames";
import { MODAL_ANIMATION_DURATION_MILLIS } from "./base-modal.const";

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
  disabled?: boolean;
  size?: "sm";
  onClose?: () => void;
  afterClose?: () => void;
}

export const Modal: FC<ModalProps> = ({
  open,
  title,
  description,
  closable = true,
  maskClosable = true,
  confirmButton,
  cancelButton,
  loading,
  disabled,
  size = "sm",
  onClose,
  afterClose,
  children,
  ...props
}) => {
  const [internalOpen, setInternalOpen] = useState(open);

  useEffect(() => {
    const isModalClosing = internalOpen && !open;
    if (isModalClosing && afterClose) {
      setTimeout(() => {
        afterClose();
      }, MODAL_ANIMATION_DURATION_MILLIS);
    }

    if (internalOpen !== open) {
      setInternalOpen(open);
    }
  }, [open]);

  return (
    <Dialog.Root open={open} {...props}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={classNames(styles.modalOverlay, styles[size])}
          onClick={maskClosable && closable && !loading ? onClose : undefined}
        >
          <Dialog.Content
            className={styles.modalContent}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div className={styles.heading}>
              <div className={styles.titlesWrapper}>
                <VisuallyHidden.Root asChild>
                  <Dialog.Title></Dialog.Title>
                </VisuallyHidden.Root>
                <Heading withoutMargins size={5} weight={500}>
                  {title}
                </Heading>
                <VisuallyHidden.Root asChild>
                  <Dialog.Description>{description}</Dialog.Description>
                </VisuallyHidden.Root>
                <Text withoutMargins>{description}</Text>
              </div>
              {/* {closable ? (
                <Dialog.Close asChild>
                  <IconButton
                    icon={<RiCloseLine />}
                    onClick={onClose}
                    className={styles.closeButton}
                    aria-label={t("general.modal.closeModal")}
                    disabled={loading}
                  />
                </Dialog.Close>
              ) : null} */}
            </div>
            <div className={styles.content}>{children}</div>
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
                  disabled={loading || disabled}
                />
              ) : null}
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
