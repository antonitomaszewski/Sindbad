export interface Offer {
  id: string;                 // Pocketbase id
  title: string;
  description?: string;
  date_from?: string;         // ISO date string, może być undefined jeśli pole opcjonalne
  date_to?: string;           // ISO date string
  location?: string;
  organizer_id: string;       // id użytkownika-organizatora (relacja)
  contact?: string;
  created: string;            // ISO date string
  updated: string;            // ISO date string
}