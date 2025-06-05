import { FC, Fragment } from "react";
import styles from "./breadcrumb.module.scss";
import { RiArrowRightSLine } from "@remixicon/react";
import { Button } from "../button";
import classNames from "classnames";

export interface BreadcrumbProps {
  links: {
    label: string;
    pathname?: string;
  }[];
  onClickLink: (pathname: string) => void;
}

export const Breadcrumb: FC<BreadcrumbProps> = ({ links, onClickLink }) => {
  return (
    <div className={styles.breadcrumb}>
      {links.map((link, key) => {
        const isLast = key === links.length - 1;

        return (
          <Fragment key={key}>
            <Button
              className={classNames(isLast && styles.active)}
              tabIndex={isLast ? -1 : undefined}
              variant="link"
              label={link.label}
              onClick={
                !isLast && link.pathname
                  ? () => {
                      onClickLink(link.pathname!);
                    }
                  : undefined
              }
            />
            {!isLast ? <RiArrowRightSLine /> : null}
          </Fragment>
        );
      })}
    </div>
  );
};
