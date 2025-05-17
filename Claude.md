src/
├── config/                  # Konfiguracja aplikacji
│   ├── db.ts                # Konfiguracja bazy danych
│   ├── auth.ts              # Konfiguracja uwierzytelniania
│   └── constants.ts         # Stałe aplikacji
│
├── types/                   # Definicje typów TypeScript
│   ├── user.types.ts        # Typy dla użytkowników i organizatorów
│   ├── cruise.types.ts      # Typy dla rejsów
│   ├── booking.types.ts     # Typy dla rezerwacji
│   ├── payment.types.ts     # Typy dla płatności
│   ├── review.types.ts      # Typy dla ocen i opinii
│   └── notification.types.ts # Typy dla powiadomień
│
├── models/                  # Modele danych
│   ├── User.ts              # Model użytkownika
│   ├── Organizer.ts         # Model organizatora (może dziedziczyć po User)
│   ├── Cruise.ts            # Model rejsu
│   ├── Booking.ts           # Model rezerwacji
│   ├── Payment.ts           # Model płatności
│   ├── Review.ts            # Model ocen i opinii
│   └── Notification.ts      # Model powiadomień
│
├── controllers/             # Kontrolery obsługujące logikę biznesową
│   ├── userController.ts    # Kontroler użytkowników
│   ├── organizerController.ts # Kontroler organizatorów
│   ├── cruiseController.ts  # Kontroler rejsów
│   ├── bookingController.ts # Kontroler rezerwacji
│   ├── paymentController.ts # Kontroler płatności
│   ├── reviewController.ts  # Kontroler opinii
│   └── notificationController.ts # Kontroler powiadomień
│
├── routes/                  # Definicje tras API
│   ├── userRoutes.ts        # Trasy dla użytkowników
│   ├── organizerRoutes.ts   # Trasy dla organizatorów
│   ├── cruiseRoutes.ts      # Trasy dla rejsów
│   ├── bookingRoutes.ts     # Trasy dla rezerwacji
│   ├── paymentRoutes.ts     # Trasy dla płatności
│   ├── reviewRoutes.ts      # Trasy dla opinii
│   └── notificationRoutes.ts # Trasy dla powiadomień
│
├── services/                # Serwisy zawierające logikę biznesową
│   ├── userService.ts       # Serwis użytkowników
│   ├── cruiseService.ts     # Serwis rejsów
│   ├── bookingService.ts    # Serwis rezerwacji
│   ├── paymentService.ts    # Serwis płatności
│   ├── reviewService.ts     # Serwis opinii
│   ├── notificationService.ts # Serwis powiadomień
│   ├── searchService.ts     # Serwis wyszukiwania rejsów
│   └── emailService.ts      # Serwis wysyłania emaili
│
├── middleware/              # Middleware
│   ├── auth.ts              # Middleware uwierzytelniania
│   ├── validation.ts        # Walidacja danych wejściowych
│   ├── errorHandler.ts      # Obsługa błędów
│   └── logger.ts            # Logowanie
│
├── utils/                   # Narzędzia pomocnicze
│   ├── validators.ts        # Funkcje walidacyjne
│   ├── formatters.ts        # Funkcje formatujące dane
│   ├── dateUtils.ts         # Funkcje operacji na datach
│   └── geoUtils.ts          # Funkcje do obsługi lokalizacji
│
├── public/                  # Zasoby statyczne (jeśli używasz)
│
├── views/                   # Szablony widoków (jeśli używasz)
│
├── tests/                   # Testy
│   ├── unit/                # Testy jednostkowe
│   ├── integration/         # Testy integracyjne
│   └── e2e/                 # Testy end-to-end
│
└── app.ts                   # Główny plik aplikacji