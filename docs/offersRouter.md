import { publicProcedure, router } from '../trpc';

export const offersRouter = router({
  // Pobierz listę ofert (z filtrami)
  getOffers: publicProcedure
    .input(z.object({ filter: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      // Pobierz z bazy z filtrami
    }),

  // Pobierz szczegóły oferty
  getOfferById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      // Pobierz ofertę po ID
    }),

  // Dodaj ofertę
  createOffer: publicProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      date_from: z.date(),
      date_to: z.date(),
      location: z.string(),
      contact: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Dodaj ofertę do bazy, organizer_id z kontekstu użytkownika
    }),

  // Edytuj ofertę (organizator)
  updateOffer: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      title: z.string().optional(),
      description: z.string().optional(),
      // inne pola...
    }))
    .mutation(async ({ input, ctx }) => {
      // Sprawdź czy użytkownik = organizer_id, zaktualizuj ofertę
    }),

  // Usuń ofertę (organizator)
  deleteOffer: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // Sprawdź czy użytkownik = organizer_id, usuń ofertę
    }),
});