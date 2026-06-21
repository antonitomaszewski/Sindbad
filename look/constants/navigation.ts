// lista linków: z nav i stopki
// pomoc, kontakt, prywatnośc, prywatność nie są zaimplementowane, 
// bo byłyby to zwykłe strony tekstowe
// dostęp do linków zrobiony dla sensu ogólnego wyglądu strony 
import { LinkItem } from '../types/common';

export const MAIN_NAVIGATION: LinkItem[] = [
  { href: "/kalendarz", label: "Kalendarz" },
  { href: "/mapa", label: "Mapa" },
  { href: "/szukaj", label: "Szukaj" },
  { href: "/pomoc", label: "Pomoc" }
];

export const ACTIVITIES_LINKS: LinkItem[] = [
  { href: "/kalendarz", label: "Kalendarz" },
  { href: "/mapa", label: "Mapa" },
  { href: "/szukaj", label: "Szukaj" }
];

export const HELP_LINKS: LinkItem[] = [
  { href: "/kontakt", label: "Kontakt" },
  { href: "/regulamin", label: "Regulamin" },
  { href: "/prywatnosc", label: "Prywatność" }
];