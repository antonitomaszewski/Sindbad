/**
 * Statyczna lista krajów do rejsów.
 * W bazie danych przechowujemy WYŁĄCZNIE code (np. "PL", "HR").
 * Używamy tego jako jedynego source of truth w całym projekcie.
 */

export interface Country {
  code: string;
  name: string; // angielska nazwa (nie używana w UI)
  namePL: string; // polska nazwa wyświetlana w UI
}

export const COUNTRIES: Country[] = [
  { code: 'AL', name: 'Albania', namePL: 'Albania' },
  { code: 'HR', name: 'Croatia', namePL: 'Chorwacja' },
  { code: 'CZ', name: 'Czech Republic', namePL: 'Czechy' },
  { code: 'DK', name: 'Denmark', namePL: 'Dania' },
  { code: 'EE', name: 'Estonia', namePL: 'Estonia' },
  { code: 'FI', name: 'Finland', namePL: 'Finlandia' },
  { code: 'FR', name: 'France', namePL: 'Francja' },
  { code: 'GR', name: 'Greece', namePL: 'Grecja' },
  { code: 'ES', name: 'Spain', namePL: 'Hiszpania' },
  { code: 'IE', name: 'Ireland', namePL: 'Irlandia' },
  { code: 'IS', name: 'Iceland', namePL: 'Islandia' },
  { code: 'IT', name: 'Italy', namePL: 'Włochy' },
  { code: 'LV', name: 'Latvia', namePL: 'Łotwa' },
  { code: 'LT', name: 'Lithuania', namePL: 'Litwa' },
  { code: 'ME', name: 'Montenegro', namePL: 'Czarnogóra' },
  { code: 'NL', name: 'Netherlands', namePL: 'Holandia' },
  { code: 'NO', name: 'Norway', namePL: 'Norwegia' },
  { code: 'PL', name: 'Poland', namePL: 'Polska' },
  { code: 'PT', name: 'Portugal', namePL: 'Portugalia' },
  { code: 'SE', name: 'Sweden', namePL: 'Szwecja' },
  { code: 'TR', name: 'Turkey', namePL: 'Turcja' },
  { code: 'UA', name: 'Ukraine', namePL: 'Ukraina' },
];

export const COUNTRIES_BY_NAME_PL = [...COUNTRIES].sort((a, b) =>
  a.namePL.localeCompare(b.namePL, 'pl')
);

/**
 * Pobierz polską nazwę kraju z kodu ISO.
 * Zwraca kod jeśli kraj nie jest na liście.
 */
export function getCountryName(code: string): string {
  if (!code) return '';
  const country = COUNTRIES.find((c) => c.code === code);
  return country?.namePL ?? code;
}
