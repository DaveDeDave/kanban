import { FC, useState } from "react";
import * as RadixCollapsible from "@radix-ui/react-collapsible";
import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
import styles from "./collapsible.module.scss";
import { Text } from "../typography/text";
import classNames from "classnames";

interface CollapsibleProps extends RadixCollapsible.CollapsibleProps {}

export const Collapsible: FC<CollapsibleProps> = ({ title, defaultOpen, className, children }) => {
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
        <RadixCollapsible.Trigger asChild className={styles.trigger}>
          {open ? <RiArrowDownSLine /> : <RiArrowUpSLine />}
        </RadixCollapsible.Trigger>
      </div>

      <RadixCollapsible.Content>{children}</RadixCollapsible.Content>
    </RadixCollapsible.Root>
  );
};
