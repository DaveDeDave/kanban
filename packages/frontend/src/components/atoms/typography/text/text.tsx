import { FC, PropsWithChildren } from "react";
import styles from "./text.module.scss";
import classNames from "classnames";
import { textType } from "./text.const";

interface TextProps extends PropsWithChildren {
  type?: keyof typeof textType;
  size?: "lg" | "md" | "sm";
  weight?: 400 | 500 | 600;
  withoutMargins?: boolean;
  className?: string;
}

export const Text: FC<TextProps> = ({
  type = "paragraph",
  size = "md",
  weight = 400,
  withoutMargins,
  className,
  children
}) => {
  const T = textType[type] as keyof JSX.IntrinsicElements;

  return (
    <T
      className={classNames(
        styles.text,
        styles[type],
        styles[`text-size-${size}`],
        styles[`text-weight-${weight}`],
        withoutMargins && styles.withoutMargins,
        className
      )}
    >
      {children}
    </T>
  );
};
