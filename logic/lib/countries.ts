// do pobierania listy krajów (uzywane w filtrach wyszukiwania, tworzeniu oferty)

export type { Country } from '../constants/countries';
export { COUNTRIES, COUNTRIES_BY_NAME_PL, getCountryName } from '../constants/countries';
import { COUNTRIES_BY_NAME_PL } from '../constants/countries';
import type { Country } from '../constants/countries';

export async function getAllCountries(): Promise<Country[]> {
  return COUNTRIES_BY_NAME_PL;
}