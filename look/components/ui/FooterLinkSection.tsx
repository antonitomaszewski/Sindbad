import NavLink from "./NavLink";
import { LinkItem } from '@/look/types/common';

export default function FooterLinkSection({ 
  title, 
  links 
}: { 
  title: string; 
  links: LinkItem[] 
}) {
  return (
    <div>
      <h4 className="font-semibold text-black mb-3">{title}</h4>
      <ul className="space-y-2 text-gray">
        {links.map((link) => (
          <li key={link.href}>
            <NavLink href={link.href}>{link.label}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}