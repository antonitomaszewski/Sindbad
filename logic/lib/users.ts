import pb from './pocketbase';
import { User } from '../types/user';
import { ERRORS } from "./messages";

// Pobierz dane usera po ID
export async function getUser(id: string): Promise<User | null> {
  try {
    const record = await pb.collection('users').getOne(id);
    return record as unknown as User;
  } catch (error) {
    return null;
  }
}

// Logowanie użytkownika
export async function loginUser(email: string, password: string) {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    return authData;
  } catch (error) {
    throw new Error(ERRORS.LOGIN_FAILED);
  }
}

// Rejestracja nowego użytkownika
export async function registerUser(email: string, password: string, passwordConfirm: string, name?: string) {
  try {
    const data: any = {
      email,
      password,
      passwordConfirm, // Pocketbase wymaga tego pola!
    };
    if (name) data.name = name;
    const user = await pb.collection('users').create(data);
    return user as unknown as User;
  } catch (error) {
    throw new Error(ERRORS.REGISTRATION_FAILED);
  }
}

// Wylogowanie użytkownika (usuwa sesję)
export function logoutUser() {
  pb.authStore.clear();
}

// Pobierz aktualnie zalogowanego użytkownika
export function getCurrentUser(): User | null {
  return pb.authStore.model as User | null;
}

// (opcjonalnie) Aktualizacja użytkownika
export async function updateUser(id: string, newData: Partial<User>) {
  try {
    const user = await pb.collection('users').update(id, newData);
    return user as unknown as User;
  } catch (error) {
    throw new Error(ERRORS.UPDATE_FAILED);
  }
}