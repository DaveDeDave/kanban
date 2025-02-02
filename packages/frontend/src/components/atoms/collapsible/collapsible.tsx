import { FC, useState } from "react";
import * as RadixCollapsible from "@radix-ui/react-collapsible";
import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
import styles from "./collapsible.module.scss";
import { Text } from "../typography/text";
import classNames from "classnames";
import { ReactNode } from "@tanstack/react-router";

type Action = {
  icon: ReactNode;
  onClick: () => void;
};

interface CollapsibleProps extends RadixCollapsible.CollapsibleProps {
  actions?: Action[];
}

export const Collapsible: FC<CollapsibleProps> = ({
  title,
  defaultOpen,
  actions,
  className,
  children
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <RadixCollapsible.Root
      className={classNames(styles.collapsible, className)}
      open={open}
      onOpenChange={setOpen}
    >
      <div className={styles.header}>
        <Text type="label" weight={500}>
          {title}
        </Text>
        <div className={styles.actions}>
          {actions?.map((action, key) => (
            <div key={key} className={styles.action} onClick={action.onClick}>
              {action.icon}
            </div>
          ))}
          <RadixCollapsible.Trigger asChild className={styles.trigger}>
            {open ? <RiArrowDownSLine /> : <RiArrowUpSLine />}
          </RadixCollapsible.Trigger>
        </div>
      </div>

      <RadixCollapsible.Content>{children}</RadixCollapsible.Content>
    </RadixCollapsible.Root>
  );
};
