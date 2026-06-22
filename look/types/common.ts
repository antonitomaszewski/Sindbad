import { ReactNode } from "react";
// nav, stopka
export type LinkItem = {
  href: string;
  label: string;
};

export type NavLinkProps = {
  href: string;
  children: ReactNode;
};