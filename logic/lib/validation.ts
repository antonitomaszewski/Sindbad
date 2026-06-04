import { OfferFormData } from '../types/offer';
import type { ValidationErrors } from '../types/form';

// Constants
const VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
  MAX_IMAGE_SIZE_MB: 5,
  MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024,
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