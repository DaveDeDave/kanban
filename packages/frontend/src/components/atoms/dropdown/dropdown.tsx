import { FC } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import styles from "./dropdown.module.scss";
import { ReactNode } from "@tanstack/react-router";
import classNames from "classnames";

export interface DropdownItem {
  icon?: ReactNode;
  label: string;
  destructive?: boolean;
  onClick: () => void;
}

export interface DropdownProps extends DropdownMenu.DropdownMenuProps {
  items: DropdownItem[];
  side?: DropdownMenu.DropdownMenuContentProps["side"];
  align?: DropdownMenu.DropdownMenuContentProps["align"];
  sideOffset?: DropdownMenu.DropdownMenuContentProps["sideOffset"];
}

export const Dropdown: FC<DropdownProps> = ({
  children,
  items,
  side = "bottom",
  align = "center",
  sideOffset = 5,
  ...props
}) => {
  return (
    <DropdownMenu.Root modal={false} {...props}>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={styles.dropdown}
          sideOffset={sideOffset}
          side={side}
          align={align}
        >
          {items.map((item, key) => (
            <DropdownMenu.Item
              key={key}
              className={classNames(styles.dropdownItem, item.destructive && styles.destructive)}
              onClick={item.onClick}
            >
              {item.icon ? <span className={styles.dropdownItemIcon}>{item.icon}</span> : null}
              <span className={styles.dropdownItemLabel}>{item.label}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
