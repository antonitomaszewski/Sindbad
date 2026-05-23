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

export interface CountryMapCenter {
  lat: number;
  lon: number;
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

export const COUNTRY_MAP_CENTERS: Partial<Record<string, CountryMapCenter>> = {
  AL: { lat: 41.1533, lon: 20.1683 },
  HR: { lat: 45.1, lon: 15.2 },
  CZ: { lat: 49.8175, lon: 15.473 },
  DK: { lat: 56.2639, lon: 9.5018 },
  EE: { lat: 58.5953, lon: 25.0136 },
  FI: { lat: 61.9241, lon: 25.7482 },
  FR: { lat: 46.2276, lon: 2.2137 },
  GR: { lat: 39.0742, lon: 21.8243 },
  ES: { lat: 40.4637, lon: -3.7492 },
  IE: { lat: 53.1424, lon: -7.6921 },
  IS: { lat: 64.9631, lon: -19.0208 },
  IT: { lat: 41.8719, lon: 12.5674 },
  LV: { lat: 56.8796, lon: 24.6032 },
  LT: { lat: 55.1694, lon: 23.8813 },
  ME: { lat: 42.7087, lon: 19.3744 },
  NL: { lat: 52.1326, lon: 5.2913 },
  NO: { lat: 60.472, lon: 8.4689 },
  PL: { lat: 52.0693, lon: 19.4803 },
  PT: { lat: 39.3999, lon: -8.2245 },
  SE: { lat: 60.1282, lon: 18.6435 },
  TR: { lat: 38.9637, lon: 35.2433 },
  UA: { lat: 48.3794, lon: 31.1656 },
};

/**
 * Pobierz polską nazwę kraju z kodu ISO.
 * Zwraca kod jeśli kraj nie jest na liście.
 */
export function getCountryName(code: string): string {
  if (!code) return '';
  const country = COUNTRIES.find((c) => c.code === code);
  return country?.namePL ?? code;
}
