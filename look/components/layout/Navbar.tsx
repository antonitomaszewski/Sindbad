// pasek nawigacji
// działa na telefonie i komputerze 
// hidden md:flex oraz md:hidden

'use client';
import { useState, useEffect } from 'react';
import NavLink from '../ui/NavLink';
import Logo from '../ui/Logo';
import Container from '../ui/Container';
import Link from 'next/link';
import { MAIN_NAVIGATION } from '@/look/constants/navigation';
import pb from '../../../logic/lib/pocketbase';
import { logoutUser } from '../../../logic/lib/users';
import { User } from '../../../logic/types/user';
import {getCurrentUser} from '@/logic/lib/users';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);

    const unsubscribe = pb.authStore.onChange(() => {
      setUser(getCurrentUser());
    });

    return unsubscribe;
  }, []);

  async function handleLogout() {
    logoutUser();
    setUser(null);
    window.location.href = '/';
  }

  if (!mounted) {
    return (
      <nav className="w-full bg-white border-b border-gray shadow-sm">
        <Container className="flex items-center justify-between h-20">
          <Link href="/" aria-label="Przejdź do strony głównej">
            <Logo />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-8">
              {MAIN_NAVIGATION.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
            <div className="w-48"></div>
          </div>
        </Container>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-white border-b border-gray shadow-sm">
      <Container className="flex items-center justify-between h-20">
        <Link href="/" aria-label="Przejdź do strony głównej">
          <Logo />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8">
            {MAIN_NAVIGATION.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>

          {/* Auth Section */}
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
            {user ? (
              <>
                <Link
                  href="/oferta/nowa"
                  className="px-4 py-2 bg-main text-white rounded-lg text-sm font-semibold hover-bg-main transition shadow-md hover:shadow-lg"
                >
                  + Dodaj rejs
                </Link>
                {/* Kliknięcie w nazwę → profil użytkownika */}
                <Link 
                  href={`/profil/${user.id}`}
                  className="text-sm text-gray-700 hover-text-main font-medium transition"
                >
                  {user.name || user.email}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-red-600 border border-gray-300 rounded-lg hover:border-red-300 transition"
                >
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/logowanie"
                  className="px-4 py-2 text-sm text-gray-700 hover-text-main font-medium transition"
                >
                  Zaloguj się
                </Link>
                <Link
                  href="/rejestracja"
                  className="px-5 py-2 bg-main text-white rounded-lg text-sm font-semibold hover-bg-main transition shadow-md hover:shadow-lg"
                >
                  Zarejestruj się
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </Container>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <Container className="py-4 space-y-3">
            {MAIN_NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-gray-700 hover-text-main font-medium transition py-2"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="pt-3 border-t border-gray-200 space-y-3">
              {user ? (
                <>
                  <Link
                    href="/oferta/nowa"
                    className="block bg-main text-white px-4 py-2 rounded-lg font-semibold hover-bg-main transition text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    + Dodaj rejs
                  </Link>
                  {/* Mobile: Kliknięcie w nazwę → profil */}
                  <Link
                    href={`/profil/${user.id}`}
                    className="block text-gray-700 hover-text-main font-medium transition py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Mój profil ({user.name || user.email})
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left text-red-600 hover:text-red-700 font-medium transition py-2"
                  >
                    Wyloguj
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/logowanie"
                    className="block text-gray-700 hover-text-main font-medium transition py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Zaloguj się
                  </Link>
                  <Link
                    href="/rejestracja"
                    className="block bg-main text-white px-4 py-2 rounded-lg font-semibold hover-bg-main transition text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Zarejestruj się
                  </Link>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </nav>
  );
}