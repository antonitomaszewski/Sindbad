// logika uzytkownika w pb
// autoryzacja, pobieranie danych, aktualizacje 
// funkcje niżej są poopisywane każda z osobna

import pb from './pocketbase';
import type { User } from '../types/user';
import { ERRORS } from '../constants/messages';
import type { OAuthProvider } from '../types/auth';

// czy jest zalogowany użytkownik
// zalogowany moze dodac oferte, robic rezerwację
export function isUserLoggedIn(): boolean {
  return pb.authStore.isValid;
}

// jak klikamy w dodaj ofertę, to zalogowanego użytkownika przekieruje na formularz
// a niezalogowanego - na stronę logowania
export function subscribeAuthStateChange(onAuthChange: (isLoggedIn: boolean) => void) {
  return pb.authStore.onChange(() => {
    onAuthChange(pb.authStore.isValid);
  });
}

// pobieram usera wraz z certyfikatami, uzywany w paru miejscach
// bo wywołuje to UseUser
export async function getUser(id: string): Promise<User | null> {
    const user = await pb.collection('users').getOne(id) as User;
    const certifications = await getUserCertifications(id);
    return {
    ...user,
    certifications,
    };
}

// pobieram certyfikaty, relacja 1-wiele na user-certifications
export async function getUserCertifications(userId: string): Promise<string[]> {
  const record: any = await pb.collection('users').getOne(userId, { expand: 'certifications' });
  const certifications = record.expand?.certifications;
  return certifications?.map((c: any) => c.name);
}


// logowanie hasłem
export async function loginUser(email: string, password: string) {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    return authData;
  } catch (error) {
    throw new Error(ERRORS.LOGIN_FAILED);
  }
}

// dla osób, które mają google oauth - nie działa zmiana emaila
// Konto logowane przez OAuth. Zmiana emaila i hasła jest wyłączona.
export async function isCurrentUserOAuth(): Promise<boolean> {
  try {
    const user = pb.authStore.record;

    if (!user) return false;

    const external = await pb
      .collection('users')
      .listExternalAuths(user.id);

    return external?.length > 0;
  } catch {
    return false;
  }
}

// sprawdzanie hasła, przy jego zmianie
async function verifyCurrentPassword(currentPassword: string) {
  const currentEmail = pb.authStore.record?.email;

  if (!currentEmail) {
    throw new Error('Brak aktywnej sesji użytkownika');
  }

  if (!currentPassword) {
    throw new Error('Podaj aktualne hasło');
  }

  try {
    await pb.collection('users').authWithPassword(currentEmail, currentPassword);
  } catch {
    throw new Error('Aktualne hasło jest nieprawidłowe');
  }
}
// analogicznie jak wyżej - sprawdzamy czy mozemy zmienić emaila, i update
export async function changeUserEmail(
  userId: string,
  newEmail: string,
  currentPassword: string
): Promise<User> {
  const normalizedEmail = newEmail.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error('Podaj nowy email');
  }

  if (!normalizedEmail.includes('@')) {
    throw new Error('Podaj poprawny email');
  }

  if (await isCurrentUserOAuth()) {
    throw new Error('Dla kont OAuth zmiana emaila jest wyłączona');
  }

  await verifyCurrentPassword(currentPassword);

  try {
    const record = await pb.collection('users').update(userId, { email: normalizedEmail });
    return record as unknown as User;
  } catch (error: any) {
    throw new Error(error?.response?.message || 'Nie udało się zmienić emaila');
  }
}

// zmiana hasła, ta walidacja jest też w formularzu, tu chyba zbędna
// ale dla spokoju zostawiłem
// przy updacie hasla potrzeba podać old, new, newconfirm, oraz weryfikowca
export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
  newPasswordConfirm: string
) {
  // await verifyCurrentPassword(currentPassword);
  // return await pb.collection('users').update(userId, {
  //     oldPassword: currentPassword,
  //     password: newPassword,
  //     passwordConfirm: newPasswordConfirm,
  //   });
  if (!newPassword || newPassword.length < 8) {
    throw new Error('Nowe hasło musi mieć minimum 8 znaków');
  }

  if (newPassword !== newPasswordConfirm) {
    throw new Error('Nowe hasła nie są identyczne');
  }

  if (await isCurrentUserOAuth()) {
    throw new Error('Dla kont OAuth zmiana hasła jest wyłączona');
  }

  await verifyCurrentPassword(currentPassword);

  try {
    await pb.collection('users').update(userId, {
      oldPassword: currentPassword,
      password: newPassword,
      passwordConfirm: newPasswordConfirm,
    });
  } catch (error: any) {
    throw new Error(error?.response?.message || 'Nie udało się zmienić hasła');
  }
}

// rejestracja uzytkownika: email, hasło
export async function registerUser(
  email: string, 
  password: string, 
  passwordConfirm: string, 
  name?: string
) {
  try {
    const data: any = { email, password, passwordConfirm, emailVisibility: true };
    if (name) data.name = name;
    
    const user = await pb.collection('users').create(data);

    // szablon do ustawienia w pb
    await pb.collection('users').requestVerification(email);

    return user as unknown as User;
  } catch (error: any) {
    throw error;
  }
}

// logowanie google oauth
export async function loginWithOAuth(provider: OAuthProvider) {
  const authData = await pb.collection('users').authWithOAuth2({ 
    provider,
    createData: { emailVisibility: true }
  });
  
  return authData;
}

// https://pub.dev/documentation/pocketbase/latest/
// prosta sprawa
export function logoutUser() {
  pb.authStore.clear();
}

// uzytkownik zalogowany trzymamy w pb.authStore.record
export function getCurrentUser(): User | null {
  return pb.authStore.record as User | null;
}

// sprawdzamy czy wchodzimy na profil jako zalogowany uzytkownik
export function isCurrentServerUser(userOrId: User | string): boolean {
  const userId = typeof userOrId === 'string' ? userOrId : userOrId.id;
  return pb.authStore.record?.id === userId;
}


//  aktualizacja klienta
// export async function updateUser(id: string, newData: Partial<User>) {
  // return await pb.collection('users').update(id, newData);
// }

//  aktualizacja klienta: dane bio, imie, avatar, certyfikaty, widocznosc profilu
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    bio?: string;
    avatar?: File | null;
    profile_visibility?: 'public' | 'private';
    certifications?: string[];
  }
): Promise<User> {
  try {
    const formData = new FormData();

    if (data.name) {
      formData.append('name', data.name.trim());
    }
    if (data.bio) {
      formData.append('bio', data.bio.trim() || '');
    }
    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }
    if (data.profile_visibility) {
      formData.append('profile_visibility', data.profile_visibility);
    }

    const record = await pb.collection('users').update(userId, formData);

    // oraz na relacji certifications
    if (data.certifications) {
      const { updateUserCertifications } = await import('./certifications');
      await updateUserCertifications(userId, data.certifications);
    }

    return record as unknown as User;
  } catch (error: any) {
    throw new Error('Nie udało się zaktualizować profilu');
  }
}

// profil możemy zobaczyć gdy:
// 1. mamy wspólny rejs
// mamy publicz ny profil
// jesteśmy właścicielem profilu
export async function canAccessProfile(
  profileUserId: string,
  currentUserId?: string
): Promise<boolean> {
  const profile = await getUser(profileUserId);

  if (!profile) return false;
  if (profile.profile_visibility === 'public') return true;
  if (!currentUserId) return false;
  if (profileUserId === currentUserId) return true;
// tu sprawdzamy relację żeglował z 
  const { getUserContacts } = await import('./bookings');
  return (await getUserContacts(currentUserId)).some((contact) => contact.userId === profileUserId)
}

// usuwamy zdjęcie użytkownika
// wykorzystywane w komponencie naedycji profilu
export async function deleteUserAvatar(userId: string): Promise<User> {
  return await pb.collection('users').update(userId, {
      avatar: null,
    });
}

// zwracamy listę wszystkich organizatorów
// na widoku wyszukiwania
// na panelu powiadomień
export async function getAllOrganizers() {
  const organizers = await pb.collection('offers').getFullList({
    fields: 'organizer_id'
  })
  const uniqueOrganizerIds = [...new Set(organizers.map(x => x.organizer_id))];

  try {
    const organizers = await Promise.all(
      uniqueOrganizerIds.map(async (id) => {
          const user = await pb.collection('users').getOne(id);
          return {
            id: user.id,
            name: user.name || ''
          };
      })
    );

    return organizers
  } catch (err) {
    console.error('getAllOrganizers error:', err);
    return [];
  }
}
// poprostu ID
export async function getCurrentUserId(){
  const id = getCurrentUser()?.id;
  if (!id){
    throw new Error("nie zalogowany");
  }
  return id;
}
// pobieram email użytkoniwka, do wysyłki email - powiadomienie o rejsie
export async function getUserEmail(userId: string): Promise<string | null> {
    const user = await pb.collection('users').getOne(userId);
    return user.email || null;
}
