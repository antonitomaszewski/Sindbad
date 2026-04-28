import pb from './pocketbase';
import { User } from '../types/user';
import { ERRORS } from "./messages";

// Pobierz dane usera po ID
export async function getUser(id: string): Promise<User | null> {
  try {
    const record: any = await pb.collection('users').getOne(id);
    // pobierz czytelne nazwy certyfikatów (jeśli są)
    const certifications = await getUserCertifications(id);
    const user: User = {
      ...((record as unknown) as User),
      certifications,
    };
    return user;
  } catch (error) {
    console.error('getUser error', error);
    return null;
  }
}

export async function getUserCertifications(userId: string): Promise<string[]> {
  try {
    // Pobierz usera z expand (najprostsze i najszybsze, jeśli relacja jest poprawnie skonfigurowana)
    const record: any = await pb.collection('users').getOne(userId, { expand: 'certifications' });

    const expanded = record.expand?.certifications;
    if (Array.isArray(expanded) && expanded.length) {
      return expanded.map((c: any) => c.name ?? c.id).filter(Boolean);
    }

    // Fallback: jeśli pole przechowuje same id, pobierz je jednym zapytaniem
    const ids: string[] = Array.isArray(record.certifications) ? record.certifications.map(String) : [];
    if (ids.length === 0) return [];

    const filter = ids.map((id) => `id = "${id}"`).join(' || ');
    const certs: any[] = await pb.collection('certifications').getFullList({ filter } as any);
    return certs.map((c: any) => c.name ?? c.code ?? c.id).filter(Boolean);
  } catch (err) {
    console.warn('getUserCertifications error', err);
    return [];
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

export async function getAllUsers() {
  try {
    const records = await pb.collection('users').getFullList({ 
      sort: 'name',
      requestKey: null // Wyłącz auto-cancel dla tego requesta
    });
    console.log('getAllUsers:', records.length, records.slice(0, 3)); // DEBUG
    return records.map((r: any) => ({
      id: r.id,
      name: r.name || r.email || 'Użytkownik',
      email: r.email,
    }));
  } catch (err) {
    console.error('getAllUsers error', err);
    return [];
  }
}

// Pobierz tylko organizatorów (użytkowników którzy mają oferty)
export async function getAllOrganizers() {
  try {
    // Pobierz wszystkie oferty i wyciągnij unikalne organizer_id
    const offers = await pb.collection('offers').getFullList({ 
      fields: 'organizer_id',
      requestKey: null,
    });
    
    const uniqueOrganizerIds = [...new Set(
      offers
        .map((o: any) => o.organizer_id)
        .filter((id): id is string => Boolean(id))
    )];

    if (uniqueOrganizerIds.length === 0) return [];

    // Pobierz dane organizatorów
    const organizers = await Promise.all(
      uniqueOrganizerIds.map(async (id) => {
        try {
          const user = await pb.collection('users').getOne(id);
          return {
            id: user.id,
            name: user.name || user.email || 'Organizator',
            email: user.email,
          };
        } catch {
          return null;
        }
      })
    );

    return organizers
      .filter((o): o is { id: string; name: string; email: string } => o !== null)
      .sort((a, b) => a.name.localeCompare(b.name, 'pl'));
  } catch (err) {
    console.error('getAllOrganizers error', err);
    return [];
  }
}