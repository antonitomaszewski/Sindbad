import NavLink from '../ui/NavLink';
import Logo from '../ui/Logo';
import Container from '../ui/Container';
import { MAIN_NAVIGATION } from '@/look/constants/navigation';

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray shadow-sm">
      <Container className="flex items-center justify-between h-20">
        <Logo />
        <ul className="flex gap-8">
          {MAIN_NAVIGATION.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href}>{item.label}</NavLink>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}