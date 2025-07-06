// look/constants/calendar.ts
export const CALENDAR_TEXTS = {
  PAGE_TITLE: "Kalendarz wydarzeń",
  LOADING_MESSAGE: "Ładowanie wydarzeń...",
  ERROR_LOADING: "Błąd pobierania ofert:",
  DATE_LABEL: "Termin: ",
  DESCRIPTION_LABEL: "Opis: ",
  DESCRIPTION_PLACEHOLDER: "Szczegółowe informacje o wydarzeniu",
  DETAILS_BUTTON: "Zobacz szczegóły oferty",
  CLOSE_BUTTON: "×"
} as const;

export const CALENDAR_CONFIG = {
  INITIAL_VIEW: "dayGridMonth",
  HEIGHT: "auto",
  HEADER_TOOLBAR: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth'
  },
  EVENT_COLORS: {
    BACKGROUND: 'var(--green-main)',
    BORDER: 'var(--green-main)'
  }
} as const;