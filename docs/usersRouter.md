import { publicProcedure, router } from '../trpc';

export const usersRouter = router({
  // Pobierz dane użytkownika (np. do profilu)
  getUser: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      // Pobierz dane usera po ID
    }),
});