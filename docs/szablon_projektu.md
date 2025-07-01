/src
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

  /server
    /trpc
      trpc.ts            # Konfiguracja tRPC
      routers/
        offersRouter.ts
        usersRouter.ts

  /lib
    supabaseClient.ts    # Klient Supabase
    emailClient.ts       # Resend/EmailJS integracja

  /types
    offer.ts
    user.ts