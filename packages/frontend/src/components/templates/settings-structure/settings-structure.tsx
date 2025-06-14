import { Outlet, useNavigate } from "@tanstack/react-router";
import { FC, useMemo } from "react";
import styles from "./settings-structure.module.scss";
import { Breadcrumb, BreadcrumbProps } from "@/atoms/breadcrumb";
import { t } from "i18next";
import classNames from "classnames";

export const SettingsStructure: FC = () => {
  const navigate = useNavigate();

  const breadCrumbLinks = useMemo<BreadcrumbProps["links"]>(() => {
    return [
      {
        label: t("pages.settings.page"),
        pathname: "/app/settings"
      }
    ];
  }, []);

  const handleBreadCrumbLinkClick = (pathname: string) => {
    navigate({
      to: pathname
    });
  };

  return (
    <div className={styles.settingsStructure}>
      <div className={classNames(styles.settingsWrapper, styles.scrollable)}>
        <div className={styles.header}>
          <Breadcrumb links={breadCrumbLinks} onClickLink={handleBreadCrumbLinkClick} />
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
