export interface Offer {
  id: string;
  organizer_id: string;
  title: string;
  description?: string;
  date_from?: string;
  date_to?: string;
  location?: string;
  geo?: { lat: number; lon: number };
  port?: string;
  country?: string;
  price_per_person?: number;
  currency?: string;
  seats_total?: number;
  seats_available?: number;
  created: string;
  updated: string;
  yacht_name?: string;
}

export interface OfferFormData {
  title: string;
  description: string;
  date_from: Date | null;
  date_to: Date | null;
  country: string;
  port: string;
  geo_lat: string;
  geo_lon: string;
  price_per_person: string;
  currency: Currency;
  seats_total: string;
  seats_available: string;
  images: File[];
  yacht_name: string;
}

export type SearchOfferParams = {
  country?: string;
  port?: string;
  priceMin?: string;
  priceMax?: string;
  onlyFree?: boolean;
  organizerId?: string;
  dateFrom?: string;
  dateTo?: string;
  onlyFuture?: boolean;
};

export interface OfferFilters {
  country: string;
  port: string;
  priceMin: string;
  priceMax: string;
  onlyFree: boolean;
  organizerId: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  onlyFuture: boolean;
}

export type Currency = 'PLN' | 'EUR' | 'USD';

export const CURRENCIES = [
  { code: 'PLN' as const, symbol: 'zł', name: 'Polski złoty' },
  { code: 'EUR' as const, symbol: '€', name: 'Euro' },
  { code: 'USD' as const, symbol: '$', name: 'Dolar amerykański' },
] as const;