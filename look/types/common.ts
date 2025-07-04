import { ReactNode } from "react";

export type LinkItem = {
  href: string;
  label: string;
};

export type NavLinkProps = {
  href: string;
  children: ReactNode;
};