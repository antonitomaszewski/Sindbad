// look/constants/image.ts
export const IMAGE_MESSAGES = {
  GALLERY_TITLE: "Galeria zdjęć",
  LOADING: "Ładowanie zdjęć...",
  NO_IMAGES: "Brak zdjęć dla tej oferty",
  ERROR: "Nie udało się załadować zdjęć",
  FILE_TOO_LARGE: "Plik jest za duży",
  INVALID_FORMAT: "Nieprawidłowy format pliku"
} as const;

export const IMAGE_CONFIG = {
  THUMBNAIL_SIZE: '300x200',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  GRID_COLUMNS: {
    sm: 2,
    lg: 3
  }
} as const;