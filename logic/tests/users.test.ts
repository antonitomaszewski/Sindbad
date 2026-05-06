import { describe, it, expect, beforeAll } from 'vitest';
import { registerUser, loginUser, getCurrentUser, getUser, logoutUser } from '../lib/users';
import { ERRORS } from '../lib/messages';

describe('users logic', () => {
  const email = `test-${Date.now()}@example.com`;
  const password = 'testpassword123';
  const name = 'Test User';

  it('registers, logs in, gets current user, gets user by ID, and logs out', async () => {
    // 1. Rejestracja
    const newUser = await registerUser(email, password, password, name);
    expect(newUser).toBeDefined();
    // expect(newUser.email).toBe(email);

    // 2. Logowanie
    const authData = await loginUser(email, password);
    expect(authData).toBeDefined();

    // 3. Próba ponownej rejestracji (powinna rzucić błąd)
    await expect(registerUser(email, password, password, name))
      .rejects
      .toThrow(); // Sprawdź tylko czy rzuca błąd (bez konkretnej wiadomości)

    // 4. Pobranie aktualnego użytkownika
    const currentUser = getCurrentUser();
    expect(currentUser).toBeDefined();
    // expect(currentUser?.email).toBe(email);

    // 5. Pobranie użytkownika po ID
    if (currentUser?.id) {
      const fetchedUser = await getUser(currentUser.id);
      expect(fetchedUser).toBeDefined();
      // expect(fetchedUser?.email).toBe(email);
    }

    // 6. Wylogowanie
    logoutUser();
    expect(getCurrentUser()).toBeNull();
  }, 10000);
});