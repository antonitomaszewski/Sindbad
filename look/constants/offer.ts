// komunikaty, stałe do strony oferty
// jak by coś się chciało zmienić to wystarczy tu, a nie w pliku .tsx
export const OFFER_MESSAGES = {
  LOADING: "Ładowanie oferty...",
  NOT_FOUND: "Oferta nie została znaleziona",
  NOT_FOUND_DESCRIPTION: "Sprawdź czy adres jest poprawny lub wybierz inną ofertę z kalendarza.",
  ORGANIZER_LOADING: "Ładowanie danych organizatora...",
  RESERVATION_ALERT: "Rezerwacja!",
  CONTACT_ALERT: "Kontakt!",
  BACK_TO_CALENDAR: "← Powrót do kalendarza",
  VIEW_ORGANIZER: "→ Przejdź do profilu organizatora"
} as const;

export const OFFER_LABELS = {
  TERM: "Termin:",
  LOCATION: "Lokalizacja:",
  DESCRIPTION: "Opis",
  ORGANIZER: "Organizator",
  SEND_RESERVATION: "Wyślij rezerwację",
  ASK_QUESTION: "Zadaj pytanie",
  NOTIFY_SIMILAR: "Powiadom o podobnych rejsach",
  PER_PERSON: "za osobę"
} as const;