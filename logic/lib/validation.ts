import { OfferFormData, ValidationErrors } from '../types/offer';

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export function validateOfferForm(data: OfferFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Title
  if (!data.title.trim()) {
    errors.title = 'Tytuł jest wymagany';
  } else if (data.title.length < 3) {
    errors.title = 'Tytuł musi mieć minimum 3 znaki';
  } else if (data.title.length > 100) {
    errors.title = 'Tytuł może mieć maksymalnie 100 znaków';
  }

  // Dates
  if (!data.date_from) {
    errors.date_from = 'Data rozpoczęcia jest wymagana';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (data.date_from < today) {
      errors.date_from = 'Data rozpoczęcia nie może być w przeszłości';
    }
  }

  if (!data.date_to) {
    errors.date_to = 'Data zakończenia jest wymagana';
  }

  if (data.date_from && data.date_to && data.date_from > data.date_to) {
    errors.date_to = 'Data zakończenia musi być po dacie rozpoczęcia';
  }

  // Location
  if (!data.country.trim()) {
    errors.country = 'Kraj jest wymagany';
  }

  if (!data.port.trim()) {
    errors.port = 'Port jest wymagany';
  }

  // Price
  if (data.price_per_person && Number(data.price_per_person) < 0) {
    errors.price_per_person = 'Cena nie może być ujemna';
  }

  // Seats
  const seatsTotal = Number(data.seats_total);
  const seatsAvailable = Number(data.seats_available);

  if (data.seats_total && seatsTotal <= 0) {
    errors.seats_total = 'Liczba miejsc musi być większa od 0';
  }

  if (data.seats_available && seatsAvailable < 0) {
    errors.seats_available = 'Liczba wolnych miejsc nie może być ujemna';
  }

  if (data.seats_total && data.seats_available && seatsAvailable > seatsTotal) {
    errors.seats_available = 'Liczba wolnych miejsc nie może być większa niż całkowita';
  }

  // Images
  if (data.images.length > 0) {
    for (const file of data.images) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        errors.images = `Zdjęcie "${file.name}" jest za duże (max ${MAX_IMAGE_SIZE_MB}MB)`;
        break;
      }
      if (!file.type.startsWith('image/')) {
        errors.images = `Plik "${file.name}" nie jest zdjęciem`;
        break;
      }
    }
  }

  return errors;
}