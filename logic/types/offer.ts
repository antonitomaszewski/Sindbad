export interface Offer {
  id: string;                 // Pocketbase id
  organizer_id: string;       // id użytkownika-organizatora (relacja)
  title: string;
  description?: string;
  date_from?: string;         // ISO date string, może być undefined jeśli pole opcjonalne
  date_to?: string;           // ISO date string
  location?: string;
  geo?: { lat: number; lon: number };
  port?: string;
  country?: string;
  price_per_person?: number;
  currency?: string;
  seats_total?: number;
  seats_available?: number;
  created: string;            // ISO date string
  updated: string;            // ISO date string
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
}

export type Currency = 'PLN' | 'EUR' | 'USD';

export const CURRENCIES = [
  { code: 'PLN' as const, symbol: 'zł', name: 'Polski złoty' },
  { code: 'EUR' as const, symbol: '€', name: 'Euro' },
  { code: 'USD' as const, symbol: '$', name: 'Dolar amerykański' },
] as const;