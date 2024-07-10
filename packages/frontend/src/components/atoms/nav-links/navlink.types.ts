import { LinkProps as RouterNavLinkProps } from "@tanstack/react-router";

export interface NavLinkProps {
  label: string;
  path: RouterNavLinkProps["to"];
}
