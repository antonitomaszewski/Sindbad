// logika rezerwacji, kontaktów miedzy uzytkownikami
// dosyć ważny moduł, bo to platforma do rezerwacji

import pb from './pocketbase';
import type {
  Booking,
  BookingStatus,
  BookingWithOffer,
  GuestBookingData,
  OfferParticipant,
  UserContact,
} from '../types/booking';
import {getTripsByOrganizer} from './offers';
import { getOfferById, updateAvailableSeats, validateSeatsAvailable } from './offers';
import { sendBookingStatusEmail, sendBookingEmails } from './emails';
import {isUserLoggedIn} from './users';

const BOOKINGS_COLLECTION = 'bookings';

type BookingCreateData = {
  offer_id: string;
  status: 'pending';
  message: string;
  user_id?: string;
  guest_name?: string;
  guest_email?: string;
};


// rezerwację może składać:
// 1. osoba, co jest zalogowan
// 2. niezalogowana, co wypełniła formularz
function validateBookingAccess(guestData?: GuestBookingData) {
  if (isUserLoggedIn()) {
    return;
  }

  if (!guestData || !guestData?.email) {
    throw new Error(
      'Podaj email lub zaloguj się'
    );
  }
}

async function getCurrentUser() {
  const record = pb.authStore.record;
  return {
    userId: record?.id,
    email: record?.email,
    name: record?.name,
  }
}

// bierzemy informacje o uzytkowniku, i ofertcie, by przygotować do wysyłi maila
// oraz zapisu w bazie
async function buildBookingData(
  offerId: string,
  message?: string,
  guestData?: GuestBookingData
): Promise<BookingCreateData> {
  const data: BookingCreateData = {
    offer_id: offerId,
    status: 'pending',
    message: message?.trim() || '',
  };

  if (isUserLoggedIn()) {
    const currentUser = await getCurrentUser();
    return {
      ...data,
      user_id: currentUser.userId,
      guest_email: currentUser.email,
      guest_name: currentUser.name,
    };
  }

  return {
    ...data,
    guest_name: guestData?.name,
    guest_email: guestData?.email || '',
  };
}

// sprawdzamy czy załogant będzie na tym rejsie
// uzywamy w celu sprawdzwnia czy mozna mu wyswietlic listę załogantów
// i prz ykomentarzach
export async function hasConfirmedBookingForOffer(offerId: string, userId: string): Promise<boolean> {
  const list = await pb.collection(BOOKINGS_COLLECTION).getList(1, 1, {
    filter: `offer_id = "${offerId}" && user_id = "${userId}" && status = "confirmed"`,
  });

  return list.totalItems > 0;
}

// do wyświetlania na stronie głównej
export async function getConfirmedBookingsCount() {
  const record = pb.collection(BOOKINGS_COLLECTION).getList(1, 1, {
    filter: 'status = "confirmed"',
  });
  return (await record).totalItems;
}

// pobieramy wszystkie oferty, dla których
// uzytkownik był: jako załogant (1) i jako organizator (2)
// an8g9rlfw371lia eg 3 załogant, 1 organizator
export async function getUserOffers(userId: string, _filter:string=""): Promise<string[]>{
  let userOffers = await pb.collection(BOOKINGS_COLLECTION).getFullList(
    {
      filter: `user_id = "${userId}" && status = "confirmed" ${_filter}`,
      fields: "offer_id",
    }
  );
  let organized = await getTripsByOrganizer(userId);
  return [...userOffers.map((record) => record.offer_id), ...organized.map(record => record.id)];
}


// używam w znajdowaniu kontaktów
// _filter = `&& user_id != "${userId}"` do wykluczenia "nas samych"
// 3. dla każdej z ofert bierzemy wszystkie rezerwacje, które mają status confirmed
// i stąd bierzemy wszystkich userów
// i zwracamy czyli user + oferta
export async function getOffersParticipants(offer_ids: string[], _filter:string = ""): Promise<{ offer_id: string; user_id: string }[]>{
  let filter = offer_ids.map((offer_id) => `offer_id = "${offer_id}"`).join(" || ");
  // wszsyscy załoganci
  const bookings = (await pb.collection(BOOKINGS_COLLECTION).getFullList(
    {
      filter: `(${filter}) && status = "confirmed" ${_filter}`,
      fields: "user_id, offer_id",
    }
  )).map(x => ({ offer_id: x['offer_id'] as string, user_id: x['user_id'] as string }));

  // tu dostae organizatorów tych rejsówj
  filter = offer_ids.map((offer_id) => `id = "${offer_id}"`).join(" || ");
  const organizers = (await pb.collection('offers').getFullList(
    {
      filter: `${filter}`,
      fields: "organizer_id, id"
    }
  )).map(x => ({'offer_id': x['id'], 'user_id': x['organizer_id']}));

  return [...bookings, ...organizers];
}

// user : lista rejsów
// mapowanie , do zwrócenia wo wyswietlenia na stronie profilu użytkownika
async function mapOfferUsersToContacts(
  rows: { offer_id: string; user_id: string }[]
): Promise<UserContact[]> {
  const result: UserContact[] = [];

  for (const row of rows) {
    const offer = await getOfferById(row.offer_id);
    const user = await pb.collection('users').getOne(row.user_id, { fields: 'id,name' });

    let contact = result.find((c) => c.userId === row.user_id);
    if (!contact) {
      contact = { userId: row.user_id, name: user.name || 'User', trips: [] };
      result.push(contact);
    }

    contact.trips.push({
      offerId: row.offer_id,
      title: offer?.title || 'Rejs',
      date_from: offer?.date_from,
      date_to: offer?.date_to,
    });
  }

  return result;
}

// pobieramy listę naszych kontaktów
// sa to osoby ktore byly z nami na rejsie jako zalogant, oraz organizator
// zarowno na rejsach , ktore my organizowalismy i na ktorych bylismy zalogantami
export async function getUserContacts(
  userId: string
): Promise<UserContact[]> {
  // 1. wszystkie rezerwacje użytkownika potwierdzone - z nich bierzemy rejsy na których byl/bedzie
  const userOffers = await getUserOffers(userId);
  // const _filter = `&& user_id != "${userId}"`
  const offersParticipants = (await getOffersParticipants(userOffers)).filter(x => x['user_id'] != userId);
  return mapOfferUsersToContacts(offersParticipants);
}


// tworzymy rezerwację:
// używane w oferta->modal rezerwacji
// sprawdzamy 1 czy osoba może rezerwować
// tworzymy rezerwację i wysyłamy maile (organizator, uczestnik)
export async function createBooking(
  offerId: string,
  message?: string,
  guestData?: GuestBookingData
): Promise<Booking> {
  validateBookingAccess(guestData);

  const offer = await getOfferById(offerId);
  
  if (!offer) {
    throw new Error('Oferta nie istnieje');
  }

  validateSeatsAvailable(offer);

  const data = await buildBookingData(
    offerId,
    message,
    guestData
  );

  const record = await pb.collection(BOOKINGS_COLLECTION).create(data) as Booking;

  await sendBookingEmails({
    offer,
    offerId,
    message,
    guestData,
    bookingRecipient: {
      email: record.guest_email,
      name: record.guest_name,
    },
  });

  return record;
}

// pobieramy wszystkie rezerwacje dla danej ofery - do wyswietlenia w panelu organizatora
export async function getOfferBookings(offerId: string): Promise<Booking[]> {
  return await pb.collection(BOOKINGS_COLLECTION).getFullList({
    filter: `offer_id = "${offerId}"`
  });
}

// przy zmiani statusu rezerwacji zawsze wysyłamy maila z powiadomomieniem co i jak się zmieniło
// musimy sprawdzić czy są dostepne miejsca jesli to potiwerdzenie rezerwacji
// i czy status się zmienił
// aktualizujemy liczbę miejsc, status na bazie i 
export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<void> {
  const current = await pb.collection(BOOKINGS_COLLECTION).getOne(bookingId) as Booking;
  const previousStatus = current.status as BookingStatus;

  if (previousStatus === status) {
    return;
  }

  const offer = await getOfferById(current.offer_id);

  if (!offer) {
    throw new Error('Oferta nie istnieje');
  }

  if (status === 'confirmed' && previousStatus !== 'confirmed') {
    validateSeatsAvailable(offer);
  }

  await pb.collection(BOOKINGS_COLLECTION).update(bookingId, {
    status,
  });

  await updateAvailableSeats({
    offer,
    previousStatus,
    newStatus: status,
  });

  await sendBookingStatusEmail({
    booking: current,
    offer,
    status,
  });
}

// wyświetlamy na profilu użytkownika jego rezerwacje
// widok ten jest widoczny wyłącznie dla osoby, która wchodzi na swój profil
// (Sindbad/look/components/profile/UserProfile.tsx)
// możemy sobie potem filtrować po statusach rezerwacji
export async function getUserBookingsWithOffers(userId: string): Promise<BookingWithOffer[]> {
  const records = pb.collection(BOOKINGS_COLLECTION).getFullList({
    filter: `user_id = "${userId}"`,
    expand: 'offer_id',
  });

  return (await records).map(record => ({
    id: record.id,
    user_id: record.user_id,
    status: record.status,
    offer_id: record.offer_id,
    message: record.message,
    guest_name: record.guest_name,
    guest_email: record.guest_email,
    created: record.created,
    updated: record.updated,

    offer: record.expand?.offer_id ?
    {
      id: record.expand.offer_id.id,
      title: record.expand.offer_id.title,
      date_from: record.expand.offer_id.date_from,
      date_to: record.expand.offer_id.date_to,
    } : undefined

  }))
}

// uczestników rejsu widzi
// 1. organizator
// 2. wspólny załogant (hasConfirmedBookingForOffer)
// oczywiscie musi być zalogowany
// uzywane na stronie oferty rejsu
export async function canViewParticipants(
  offerId: string
): Promise<boolean> {
  const currentUserId = pb.authStore.record?.id;

  if (!currentUserId) {
    return false;
  }

  const offer = await getOfferById(offerId);

  if (!offer) {
    return false;
  }

  if (offer.organizer_id === currentUserId) {
    return true;
  }

  return hasConfirmedBookingForOffer(offerId, currentUserId);
}


// na stronie oferty, wyświetlamy uczestników rejsu
// pojawiają się oni dla 2 kategorii użytkowników
// 1. organizator (on/ona takze ma osobny panel do akceptowania zgłoszeń)
// 2. uczestnik z potwierdzoną rezerwacją
// także tutaj dla każdej oferty pobieram uzytkowników, którzy własnie mają confirmed
// możemy sobie w takowego gościa profil wejść
// jak ktoś się zapisze bez konta (to go nie wyświetlamy, bo nie jest użytkownikiem i tyle)
export async function getConfirmedParticipants(
  offerId: string
): Promise<OfferParticipant[]> {
  try {
    const records: any[] = await (pb.collection(BOOKINGS_COLLECTION) as any).getFullList({
      filter: `offer_id = "${offerId}" && status = "confirmed" && user_id != ""`,
      expand: 'user_id',
      sort: 'created',
    });

    const participants = new Map<string, OfferParticipant>();

    for (const record of records) {
      const expandedUser = record.expand?.user_id;

      const userId = String(record.user_id);
      if (!userId || participants.has(userId)) {
        continue;
      }

      participants.set(userId, {
        userId,
        name: String(expandedUser?.name || ''),
      });
    }

    return Array.from(participants.values());
  } catch (err) {
    console.warn('getConfirmedParticipants error:', err);
    return [];
  }
}