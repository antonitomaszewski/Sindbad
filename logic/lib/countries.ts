// Re-eksport statycznej listy krajów ze shared constants.
// Utrzymujemy getAllCountries() jako async dla zgodności z istniejącymi call-sites.
export type { Country } from '../constants/countries';
export { COUNTRIES, COUNTRIES_BY_NAME_PL, getCountryName } from '../constants/countries';
import { COUNTRIES_BY_NAME_PL } from '../constants/countries';
import type { Country } from '../constants/countries';

export async function getAllCountries(): Promise<Country[]> {
  return COUNTRIES_BY_NAME_PL;
}