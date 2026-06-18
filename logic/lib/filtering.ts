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
): Offer[] {
  let results = offers;

  if (filters.country) {
    // Przechowujemy country jako ISO code (np. "PL"), więc porównujemy bezpośrednio.
    results = results.filter((o) => o.country === filters.country);
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