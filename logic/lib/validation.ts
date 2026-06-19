// tu są reguły walidacji formularzy
// 1 zmian na profilu uzytkownika
// 2. tworzenie oferty. to takie nasze 2 podstawowe formularze w których się poruszamy
// maks rozmiar zdjęć w pb to 5mb, stąd wymagany max_size
// są używane właśnie w komonentach należących do jednego z tyych dwóch rodzajów
// (formularza oferty i komponenty formularza zmiany na profilu uzytkownika)


import { OfferFormData } from '../types/offer';
import type { ValidationErrors } from '../types/form';

export interface ProfileFormData {
  name: string;
  bio: string;
  avatar: File | null;
}

export interface EmailChangeData {
  email: string;
  currentPasswordForEmail: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

// Constants
const VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
  MAX_IMAGE_SIZE_MB: 5,
  MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024,
  MAX_AVATAR_SIZE_MB: 5,
  MAX_AVATAR_SIZE_BYTES: 5 * 1024 * 1024,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  BIO_MAX_LENGTH: 1000,
  PASSWORD_MIN_LENGTH: 8,
} as const;

const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: 'Tytuł jest wymagany',
  TITLE_TOO_SHORT: `Tytuł musi mieć minimum ${VALIDATION_RULES.TITLE_MIN_LENGTH} znaki`,
  TITLE_TOO_LONG: `Tytuł może mieć maksymalnie ${VALIDATION_RULES.TITLE_MAX_LENGTH} znaków`,
  DESCRIPTION_TOO_LONG: `Tytuł może mieć maksymalnie ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} znaków`,
  DATE_FROM_REQUIRED: 'Data rozpoczęcia jest wymagana',
  DATE_FROM_PAST: 'Data rozpoczęcia nie może być w przeszłości',
  DATE_TO_REQUIRED: 'Data zakończenia jest wymagana',
  DATE_TO_BEFORE_FROM: 'Data zakończenia musi być po dacie rozpoczęcia',
  COUNTRY_REQUIRED: 'Kraj jest wymagany',
  PORT_REQUIRED: 'Port jest wymagany',
  PRICE_NEGATIVE: 'Cena nie może być ujemna',
  SEATS_TOTAL_INVALID: 'Liczba miejsc musi być większa od 0',
  SEATS_AVAILABLE_NEGATIVE: 'Liczba wolnych miejsc nie może być ujemna',
  SEATS_AVAILABLE_EXCEEDS: 'Liczba wolnych miejsc nie może być większa niż całkowita',
  IMAGE_TOO_LARGE: (name: string) => 
    `Zdjęcie "${name}" jest za duże (max ${VALIDATION_RULES.MAX_IMAGE_SIZE_MB}MB)`,
  IMAGE_INVALID_TYPE: (name: string) => 
    `Plik "${name}" nie jest zdjęciem`,
} as const;

export function validateOfferForm(data: OfferFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = VALIDATION_MESSAGES.TITLE_REQUIRED;
  } else if (data.title.length < VALIDATION_RULES.TITLE_MIN_LENGTH) {
    errors.title = VALIDATION_MESSAGES.TITLE_TOO_SHORT;
  } else if (data.title.length > VALIDATION_RULES.TITLE_MAX_LENGTH) {
    errors.title = VALIDATION_MESSAGES.TITLE_TOO_LONG;
  }

  // description validation
  if (data.description.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH) {
    errors.title = VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG;
  }

  // Date validation
  if (!data.date_from) {
    errors.date_from = VALIDATION_MESSAGES.DATE_FROM_REQUIRED;
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (data.date_from < today) {
      errors.date_from = VALIDATION_MESSAGES.DATE_FROM_PAST;
    }
  }

  if (!data.date_to) {
    errors.date_to = VALIDATION_MESSAGES.DATE_TO_REQUIRED;
  }

  if (data.date_from && data.date_to && data.date_from > data.date_to) {
    errors.date_to = VALIDATION_MESSAGES.DATE_TO_BEFORE_FROM;
  }

  // Location validation
  if (!data.country.trim()) {
    errors.country = VALIDATION_MESSAGES.COUNTRY_REQUIRED;
  }

  if (!data.port.trim()) {
    errors.port = VALIDATION_MESSAGES.PORT_REQUIRED;
  }

  // Price validation
  if (data.price_per_person && Number(data.price_per_person) < 0) {
    errors.price_per_person = VALIDATION_MESSAGES.PRICE_NEGATIVE;
  }

  // Seats validation
  const seatsTotal = Number(data.seats_total);
  const seatsAvailable = Number(data.seats_available);

  if (data.seats_total && seatsTotal <= 0) {
    errors.seats_total = VALIDATION_MESSAGES.SEATS_TOTAL_INVALID;
  }

  if (data.seats_available && seatsAvailable < 0) {
    errors.seats_available = VALIDATION_MESSAGES.SEATS_AVAILABLE_NEGATIVE;
  }

  if (data.seats_total && data.seats_available && seatsAvailable > seatsTotal) {
    errors.seats_available = VALIDATION_MESSAGES.SEATS_AVAILABLE_EXCEEDS;
  }

  // Image validation
  if (data.images.length > 0) {
    for (const file of data.images) {
      if (file.size > VALIDATION_RULES.MAX_IMAGE_SIZE_BYTES) {
        errors.images = VALIDATION_MESSAGES.IMAGE_TOO_LARGE(file.name);
        break;
      }
      if (!file.type.startsWith('image/')) {
        errors.images = VALIDATION_MESSAGES.IMAGE_INVALID_TYPE(file.name);
        break;
      }
    }
  }

  return errors;
}

export function validateProfileForm(data: ProfileFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Imię i nazwisko jest wymagane';
  } else if (data.name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    errors.name = `Imię i nazwisko musi mieć minimum ${VALIDATION_RULES.NAME_MIN_LENGTH} znaki`;
  } else if (data.name.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    errors.name = `Imię i nazwisko może mieć maksymalnie ${VALIDATION_RULES.NAME_MAX_LENGTH} znaków`;
  }

  if (data.bio.length > VALIDATION_RULES.BIO_MAX_LENGTH) {
    errors.bio = `Opis może mieć maksymalnie ${VALIDATION_RULES.BIO_MAX_LENGTH} znaków`;
  }

  return errors;
}

export function validateEmailChange(data: EmailChangeData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.email.trim()) {
    errors.email = 'Email jest wymagany';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Podaj poprawny adres email';
  }

  if (!data.currentPasswordForEmail.trim()) {
    errors.currentPasswordForEmail = 'Aktualne hasło jest wymagane';
  }

  return errors;
}

export function validatePasswordChange(data: PasswordChangeData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.currentPassword) {
    errors.currentPassword = 'Aktualne hasło jest wymagane';
  }

  if (!data.newPassword) {
    errors.newPassword = 'Nowe hasło jest wymagane';
  } else if (data.newPassword.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errors.newPassword = `Hasło musi mieć minimum ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} znaków`;
  }

  if (!data.newPasswordConfirm) {
    errors.newPasswordConfirm = 'Potwierdzenie hasła jest wymagane';
  } else if (data.newPassword !== data.newPasswordConfirm) {
    errors.newPasswordConfirm = 'Hasła nie są identyczne';
  }

  return errors;
}

export function validateAvatar(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Wybrany plik nie jest zdjęciem.';
  }
  if (file.size > VALIDATION_RULES.MAX_AVATAR_SIZE_BYTES) {
    return `Zdjęcie jest za duże. Maksymalny rozmiar to ${VALIDATION_RULES.MAX_AVATAR_SIZE_MB}MB.`;
  }
  return null;
}