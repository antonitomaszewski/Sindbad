import { describe, it, expect } from 'vitest';
import { registerUser, loginUser, getCurrentUser, getUser, logoutUser } from '../lib/users';

describe('users logic', () => {
  const email = `test-${Date.now()}@example.com`;
  const password = 'testpassword123';
  const name = 'Test User';

  it('registers, logs in, gets current user, gets user by ID, and logs out', async () => {
    // 1. Rejestracja
    const newUser = await registerUser(email, password, password, name);
    expect(newUser).toBeDefined();

    // 2. Logowanie
    const authData = await loginUser(email, password);
    expect(authData).toBeDefined();

    // 3. Próba ponownej rejestracji (powinna rzucić błąd)
    await expect(registerUser(email, password, password, name))
      .rejects
      .toThrow();

    // 4. Pobranie aktualnego użytkownika
    const currentUser = getCurrentUser();
    expect(currentUser).toBeDefined();

    // 5. Pobranie użytkownika po ID
    if (currentUser?.id) {
      const fetchedUser = await getUser(currentUser.id);
      expect(fetchedUser).toBeDefined();
    }

    // 6. Wylogowanie
    logoutUser();
    expect(getCurrentUser()).toBeNull();
  }, 10000);
});