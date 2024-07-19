import { LinkProps as RouterNavLinkProps } from "@tanstack/react-router";

interface NavLinkBaseProps {
  type: "anchor" | "action";
  label: string;
}

export interface NavLinkActionProps extends NavLinkBaseProps {
  type: "action";
  onClick: () => void;
}

export interface NavLinkAnchorProps extends NavLinkBaseProps {
  type: "anchor";
  path: RouterNavLinkProps["to"];
}

export type NavLinkProps = NavLinkActionProps | NavLinkAnchorProps;
