import { FC, PropsWithChildren } from "react";
import styles from "./heading.module.scss";
import classNames from "classnames";

interface HeadingProps extends PropsWithChildren {
  size: 1 | 2 | 3 | 4 | 5 | 6;
  weight?: 400 | 500 | 600;
  withoutMargins?: boolean;
}

export const Heading: FC<HeadingProps> = ({ size, weight = 400, withoutMargins, children }) => {
  const H = `h${size}` as keyof JSX.IntrinsicElements;

  return (
    <H
      className={classNames(
        styles.heading,
        styles[`heading-size-${size}`],
        styles[`heading-weight-${weight}`],
        withoutMargins && styles.withoutMargins
      )}
    >
      {children}
    </H>
  );
};
