import { FC, useState } from "react";
import { Dropdown, DropdownProps } from "../dropdown";
import styles from "./button-dropdown.module.scss";
import classNames from "classnames";
import { ReactNode } from "@tanstack/react-router";

export interface ButtonDropdownProps {
  icon: ReactNode;
  dropdown: DropdownProps;
}

export const ButtonDropdown: FC<ButtonDropdownProps> = ({
  icon,
  dropdown: { onOpenChange, align, items, ...dropdownProps }
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <Dropdown
      onOpenChange={(open) => {
        setIsDropdownOpen(open);
        onOpenChange?.(open);
      }}
      align={align}
      items={items}
      {...dropdownProps}
    >
      <div
        tabIndex={0}
        className={classNames(styles.buttonDropdown, isDropdownOpen && styles.isOpen)}
      >
        {icon}
      </div>
    </Dropdown>
  );
};
