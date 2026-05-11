// Re-eksport statycznej listy krajów ze shared constants.
// Utrzymujemy getAllCountries() jako async dla zgodności z istniejącymi call-sites.
export type { Country } from '../constants/countries';
export { COUNTRIES, getCountryName } from '../constants/countries';
import { COUNTRIES } from '../constants/countries';
import type { Country } from '../constants/countries';

export async function getAllCountries(): Promise<Country[]> {
  return COUNTRIES;
}