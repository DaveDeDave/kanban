import * as RadixTooltip from "@radix-ui/react-tooltip";
import { forwardRef, useState } from "react";
import { Text } from "../typography/text";
import styles from "./tooltip.module.scss";
import classNames from "classnames";

interface TooltipProps extends RadixTooltip.TooltipProps {
  variant: "primary" | "secondary";
  content: string;
  showArrow?: boolean;
  side?: RadixTooltip.TooltipContentProps["side"];
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant, content, showArrow = true, children, side, ...props }, ref) => {
    const [open, setOpen] = useState(props.defaultOpen);

    return (
      <RadixTooltip.Provider>
        <RadixTooltip.Root {...props} open={open}>
          <RadixTooltip.Trigger
            asChild
            onMouseEnter={() => setTimeout(() => setOpen(true), 250)}
            onMouseLeave={() => setTimeout(() => setOpen(false), 250)}
          >
            {children}
          </RadixTooltip.Trigger>
          <RadixTooltip.Portal>
            <RadixTooltip.Content
              ref={ref}
              side={side}
              sideOffset={5}
              className={classNames(styles.tooltip, styles[variant])}
            >
              <Text weight={variant === "primary" ? 400 : 600} withoutMargins>
                {content}
              </Text>
              {showArrow && <RadixTooltip.Arrow className={styles.arrow} />}
            </RadixTooltip.Content>
          </RadixTooltip.Portal>
        </RadixTooltip.Root>
      </RadixTooltip.Provider>
    );
  }
);
