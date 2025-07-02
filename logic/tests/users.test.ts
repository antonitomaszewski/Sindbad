import { describe, it, expect } from "vitest";
import { registerUser, loginUser, getUser, getCurrentUser, logoutUser } from "../lib/users";
import { ERRORS } from "../lib/messages";

describe("users logic", () => {
  it("registers, logs in, gets current user, gets user by ID, and logs out", async () => {
    // Losowy email, aby uniknąć konfliktów w bazie
    const email = `test${Math.random().toString(36).slice(2)}@example.com`;
    const password = "Test1234!";
    const name = "Test User";

    // 1. Logowanie przed rejestracją
    await expect(loginUser(email, password))
      .rejects
      .toThrow(ERRORS.LOGIN_FAILED);

    // Rejestracja
    const user = await registerUser(email, password, password, name);

    // 3. Próba ponownej rejestracji (powinna rzucić błąd)
    await expect(registerUser(email, password, password, name))
      .rejects
      .toThrow(ERRORS.REGISTRATION_FAILED);

    // Logowanie
    const auth = await loginUser(email, password);
    expect(auth).toBeDefined();
    expect(auth.record.email).toBe(email);

    // Pobranie obecnego użytkownika
    const current = getCurrentUser();
    expect(current).toBeDefined();
    if (!current) throw new Error("Pobranie current is null");
    expect(current.email).toBe(email);

    // Pobranie po ID (jeśli masz taką funkcję)
    const fetched = await getUser(user.id);
    expect(fetched).toBeDefined();
    if (!fetched) throw new Error("Pobranie fetched is null");
    expect(fetched.email).toBe(email);

    // Wylogowanie
    logoutUser();
    const afterLogout = getCurrentUser();
    expect(afterLogout).toBeNull();
  });
});