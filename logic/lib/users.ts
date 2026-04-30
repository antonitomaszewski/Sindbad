import pb from './pocketbase';
import { User } from '../types/user';
import { ERRORS } from './messages';
import type { OAuthProvider } from '../types/auth';

/**
 * Pobierz użytkownika po ID z rozszerzeniem certyfikatów
 */
export async function getUser(id: string): Promise<User | null> {
  try {
    const record: any = await pb.collection('users').getOne(id);
    const certifications = await getUserCertifications(id);
    return {
      ...(record as unknown as User),
      certifications,
    };
  } catch (error) {
    console.error('getUser error:', id, error);
    return null;
  }
}

/**
 * Pobierz certyfikaty użytkownika (nazwy zamiast ID)
 */
export async function getUserCertifications(userId: string): Promise<string[]> {
  try {
    const record: any = await pb.collection('users').getOne(userId, { expand: 'certifications' });
    const expanded = record.expand?.certifications;
    
    if (Array.isArray(expanded) && expanded.length) {
      return expanded.map((c: any) => c.name ?? c.id).filter(Boolean);
    }

    // Fallback: pobierz certyfikaty po ID
    const ids: string[] = Array.isArray(record.certifications) 
      ? record.certifications.map(String) 
      : [];
    
    if (ids.length === 0) return [];

    const filter = ids.map((id) => `id = "${id}"`).join(' || ');
    const certs: any[] = await pb.collection('certifications').getFullList({ filter } as any);
    
    return certs.map((c: any) => c.name ?? c.code ?? c.id).filter(Boolean);
  } catch (err) {
    console.warn('getUserCertifications error:', userId, err);
    return [];
  }
}

/**
 * Zaloguj użytkownika email/hasło
 */
export async function loginUser(email: string, password: string) {
  try {
    return await pb.collection('users').authWithPassword(email, password);
  } catch (error) {
    throw new Error(ERRORS.LOGIN_FAILED);
  }
}

/**
 * Zarejestruj nowego użytkownika
 */
export async function registerUser(
  email: string, 
  password: string, 
  passwordConfirm: string, 
  name?: string
) {
  try {
    const data: any = { email, password, passwordConfirm };
    if (name) data.name = name;
    
    const user = await pb.collection('users').create(data);
    return user as unknown as User;
  } catch (error: any) {
    // Przekaż szczegółowy błąd z PocketBase (np. "User with email already exists")
    throw new Error(error?.response?.message || ERRORS.REGISTRATION_FAILED);
  }
}

/**
 * Zaloguj przez Google OAuth
 */
export async function loginWithOAuth(provider: OAuthProvider) {
  try {
    return await pb.collection('users').authWithOAuth2({ 
      provider,
      createData: { emailVisibility: true }
    });
  } catch (error: any) {
    throw new Error(error.message || `Logowanie przez ${provider} nie powiodło się`);
  }
}

// Backward compatibility
export const loginWithGoogle = () => loginWithOAuth('google');

/**
 * Wyloguj użytkownika (wyczyść sesję)
 */
export function logoutUser() {
  pb.authStore.clear();
}

/**
 * Pobierz aktualnie zalogowanego użytkownika
 */
export function getCurrentUser(): User | null {
  return pb.authStore.model as User | null;
}

/**
 * Aktualizuj dane użytkownika
 */
export async function updateUser(id: string, newData: Partial<User>) {
  try {
    const user = await pb.collection('users').update(id, newData);
    return user as unknown as User;
  } catch (error) {
    throw new Error(ERRORS.UPDATE_FAILED);
  }
}

/**
 * Pobierz organizatorów (użytkownicy z ofertami)
 * Używane w filtrach wyszukiwania
 */
export async function getAllOrganizers() {
  try {
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
    console.error('getAllOrganizers error:', err);
    return [];
  }
}