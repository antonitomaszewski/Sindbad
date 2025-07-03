export interface Offer {
  id: string;                 // Pocketbase id
  organizer_id: string;       // id użytkownika-organizatora (relacja)
  title: string;
  description?: string;
  date_from?: string;         // ISO date string, może być undefined jeśli pole opcjonalne
  date_to?: string;           // ISO date string
  location?: string;
  geo?: { lat: number; lon: number };
  created: string;            // ISO date string
  updated: string;            // ISO date string
}