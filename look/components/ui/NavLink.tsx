import Link from "next/link";
import { NavLinkProps } from "@/look/types/common";

export default function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link href={href} className="text-black hover:text-main transition-colors">
      {children}
    </Link>
  );
}