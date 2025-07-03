/app -- cały ten folder to lukier syntaktyczny dla look/app
  /page.tsx
  /offers
    /[id]/page.tsx
    /new/page.tsx
    /edit/[id].tsx
  /search/page.tsx
  /map/page.tsx
  /profile/[id]/page.tsx


/look
  /app
    /page.tsx            # Strona główna (home)
    /offers
      /[id]/page.tsx     # Szczegóły oferty
      /new/page.tsx      # Dodawanie oferty
      /edit/[id].tsx     # Edycja oferty (opcjonalne)
    /search/page.tsx     # Wyszukiwanie
    /map/page.tsx        # Wyszukiwanie na mapie
    /profile/[id]/page.tsx # Profil użytkownika

  /components
    /ui
      OfferCard.tsx
      OfferList.tsx
      OfferForm.tsx
      UserProfile.tsx
      SearchFilters.tsx
      MapView.tsx
    /layout
      Layout.tsx (Navbar, Meta, ThemeProvider, Footer)
      Navbar.tsx
      Footer.tsx
      Meta.tsx
      ThemeProvider.tsx
  
  /constants

  /styles        # Jeden plik Tailwind config, ewentualnie globalne CSS
    tailwind.config.js

/logic
  /lib
    pocketbase.ts  # Inicjalizacja klienta Pocketbase
    offers.ts # api dla Offer
    users.ts # api dla User
    emailClient.ts       # Resend/EmailJS integracja
    
  /types
    offer.ts
    user.ts