import { Offer } from '../types/offer';

interface FilterOptions {
  country?: string;
  port?: string;
  priceMin?: string;
  priceMax?: string;
  onlyFree?: boolean;
  organizerId?: string;
}

export function filterOffers(
  offers: Offer[],
  filters: FilterOptions,
  countries: { code: string; name: string; namePL: string }[]
): Offer[] {
  let results = offers;

  if (filters.country) {
    const selectedCountry = countries.find(
      (c) => c.name === filters.country || c.namePL === filters.country
    );
    results = results.filter((o) => {
      if (!o.country) return false;
      return o.country === selectedCountry?.name || o.country === selectedCountry?.namePL;
    });
  }

  if (filters.port) {
    results = results.filter((o) =>
      o.port?.toLowerCase().includes(filters.port!.toLowerCase())
    );
  }

  if (filters.priceMin) {
    results = results.filter((o) =>
      o.price_per_person == null || o.price_per_person >= Number(filters.priceMin)
    );
  }

  if (filters.priceMax) {
    results = results.filter((o) =>
      o.price_per_person == null || o.price_per_person <= Number(filters.priceMax)
    );
  }

  if (filters.onlyFree) {
    results = results.filter((o) =>
      o.seats_available == null || o.seats_available > 0
    );
  }

  if (filters.organizerId) {
    results = results.filter((o) => o.organizer_id === filters.organizerId);
  }

  return results;
}