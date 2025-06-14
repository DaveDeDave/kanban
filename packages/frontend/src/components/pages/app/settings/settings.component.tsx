import { FC, useContext } from "react";
import styles from "./settings.module.scss";
import { Heading } from "@/atoms/typography/heading";
import { AppContext } from "@/contexts/app.context";
import { Text } from "@/atoms/typography/text";
import { Divider } from "@/atoms/divider";
import { t } from "i18next";
import { Button } from "@/atoms/button";
import { RiDeleteBin2Line } from "@remixicon/react";
import { useModal } from "@/molecules/modals/base-modal/base-modal.hooks";
import { DeleteAccountModal } from "@/molecules/modals/delete-account-modal";

export const Component: FC = () => {
  const appContext = useContext(AppContext);

  const { isOpen, hideModal, showModal } = useModal();

  if (!appContext || !appContext.user) {
    return <></>;
  }

  return (
    <>
      <DeleteAccountModal open={isOpen} onClose={hideModal} />
      <div className={styles.profileSettings}>
        <Heading withoutMargins size={5} weight={500}>
          {t("pages.settings.sections.profile.title")}
        </Heading>
        <div className={styles.informationList}>
          <Divider variant="light" />
          <div className={styles.informationRow}>
            <Text withoutMargins>{t("pages.settings.sections.profile.email")}</Text>
            <Text withoutMargins>{appContext.user.email}</Text>
          </div>
        </div>
        <Heading withoutMargins size={5} weight={500}>
          {t("pages.settings.sections.other.title")}
        </Heading>
        <div className={styles.informationList}>
          <Divider variant="light" />
          <div className={styles.informationRow}>
            <Text withoutMargins>{t("pages.settings.sections.other.deleteAccount")}</Text>
            <Button
              fitContent
              leftIcon={<RiDeleteBin2Line />}
              destructive
              label={t("pages.settings.sections.other.deleteAccountButton")}
              onClick={showModal}
            />
          </div>
        </div>
      </div>
    </>
  );
};
