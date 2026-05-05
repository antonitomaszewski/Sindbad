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
  price_per_person: string;
  currency: 'PLN' | 'EUR' | 'USD';
  seats_total: string;
  seats_available: string;
  images: File[];
}

export interface ValidationErrors {
  title?: string;
  date_from?: string;
  date_to?: string;
  country?: string;
  port?: string;
  price_per_person?: string;
  seats_total?: string;
  seats_available?: string;
  images?: string;
}

export const CURRENCIES = [
  { code: 'PLN', symbol: 'zł', name: 'Polski złoty' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'Dolar amerykański' },
] as const;