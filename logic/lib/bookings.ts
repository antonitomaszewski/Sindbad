import pb from './pocketbase';
import type {
  Booking,
  BookingStatus,
  BookingWithOffer,
  GuestBookingData,
  OfferParticipant,
  UserContact,
} from '../types/booking';
import { RecordModel } from 'pocketbase';
import { getOfferById, updateAvailableSeats, validateSeatsAvailable } from './offers';
import { sendBookingStatusEmail, sendBookingEmails } from './emails';
import { Offer } from '../types/offer';

const BOOKINGS_COLLECTION = 'bookings';

type BookingCreateData = {
  offer_id: string;
  status: 'pending';
  message: string;
  user_id?: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
};

function mapRecordToBooking(record: RecordModel): Booking {
  return {
    id: record.id,
    user_id: record.user_id,
    offer_id: record.offer_id,
    status: record.status as BookingStatus,
    message: record.message,
    created: record.created,
    updated: record.updated,
    guest_name: record.guest_name,
    guest_email: record.guest_email,
    guest_phone: record.guest_phone,
  };
}

function validateBookingAccess(guestData?: GuestBookingData) {
  if (pb.authStore.isValid) {
    return;
  }

  if (!guestData) {
    throw new Error(
      'Podaj dane kontaktowe lub zaloguj się'
    );
  }

  if (!guestData.email && !guestData.phone) {
    throw new Error('Podaj email lub telefon');
  }
}

function validateOwnOfferBooking(offer: Offer) {
  const currentUserId = pb.authStore.record?.id;

  if (!currentUserId) {
    return;
  }

  if (offer.organizer_id === currentUserId) {
    throw new Error(
      'Nie możesz zarezerwować własnej oferty'
    );
  }
}

async function resolveCurrentUserContact() {
  const record = (pb.authStore.record || {}) as {
    id?: string;
    email?: string;
    name?: string;
  };

  let email = record.email || '';
  let name = record.name || '';

  if (pb.authStore.isValid && record?.id && !email) {
    try {
      const refreshed = await (pb.collection('users') as any).authRefresh();
      email = refreshed?.record?.email || email;
      name = refreshed?.record?.name || name;
    } catch (err) {
      console.warn('resolveCurrentUserContact authRefresh failed:', err);
    }
  }

  return {
    userId: record?.id || null,
    email,
    name,
  };
}

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

  if (pb.authStore.isValid) {
    const currentUser = await resolveCurrentUserContact();
    return {
      ...data,
      user_id: currentUser.userId || undefined,
      guest_email: currentUser.email,
      guest_name: currentUser.name,
    };
  }

  return {
    ...data,
    guest_name: guestData?.name,
    guest_email: guestData?.email || '',
    guest_phone: guestData?.phone || '',
  };
}

async function listBookingsByFilter(filter: string): Promise<Booking[]> {
  const records = await pb.collection(BOOKINGS_COLLECTION).getFullList({
    filter,
    sort: '-created',
  });

  return records.map(mapRecordToBooking);
}

async function hasConfirmedBookingForOffer(offerId: string, userId: string): Promise<boolean> {
  const list = await pb.collection(BOOKINGS_COLLECTION).getList(1, 1, {
    filter: `offer_id = "${offerId}" && user_id = "${userId}" && status = "confirmed"`,
  });

  return list.totalItems > 0;
}

async function getConfirmedOfferIdsForUser(userId: string): Promise<Set<string>> {
  const bookings = await getUserBookings(userId);

  return new Set(
    bookings
      .filter((booking) => booking.status === 'confirmed')
      .map((booking) => booking.offer_id)
  );
}

export async function getUserConfirmedBookings(userId: string): Promise<Booking[]> {
  const [crewBookings, organizerBookings] = await Promise.all([
    listBookingsByFilter(`user_id = "${userId}" && status = "confirmed"`),
    listBookingsByFilter(`offer_id.organizer_id = "${userId}" && status = "confirmed"`),
  ]);

  const merged = new Map<string, Booking>();

  for (const booking of [...crewBookings, ...organizerBookings]) {
    merged.set(booking.id, booking);
  }

  return Array.from(merged.values());
}

async function getBookingOrganizer(booking: Booking): Promise<string | null> {
  const offer = await getOfferById(booking.offer_id);
  if (!offer?.organizer_id) {
    return null;
  }

  return String(offer.organizer_id);
}

export async function getBookingsOrganizers(bookings: Booking[]): Promise<Set<string>> {
  const organizers = new Set<string>();

  for (const booking of bookings) {
    const organizerId = await getBookingOrganizer(booking);
    if (organizerId) {
      organizers.add(organizerId);
    }
  }

  return organizers;
}

async function getBookingParticipants(booking: Booking): Promise<Set<string>> {
  try {
    const offer: any = await (pb.collection('offers') as any).getOne(booking.offer_id, {
      expand: 'participants',
      fields: 'id,organizer_id,participants,expand.participants.id',
    });

    const relationParticipants = new Set<string>();

    if (Array.isArray(offer?.participants)) {
      for (const participantId of offer.participants) {
        const id = String(participantId || '');
        if (id) {
          relationParticipants.add(id);
        }
      }
    }

    if (Array.isArray(offer?.expand?.participants)) {
      for (const participant of offer.expand.participants) {
        const id = String(participant?.id || '');
        if (id) {
          relationParticipants.add(id);
        }
      }
    }

    if (relationParticipants.size > 0) {
      console.log('[contacts][getBookingParticipants] source=offer.participants', {
        offerId: booking.offer_id,
        participantIds: Array.from(relationParticipants),
      });

      return relationParticipants;
    }

    console.log('[contacts][getBookingParticipants] offer.participants-empty-fallback-bookings', {
      offerId: booking.offer_id,
    });
  } catch (err) {
    console.warn('[contacts][getBookingParticipants] offer-read-failed-fallback-bookings', {
      offerId: booking.offer_id,
      err,
    });
  }

  try {
    const records: any[] = await (pb.collection(BOOKINGS_COLLECTION) as any).getFullList({
      filter: `offer_id = "${booking.offer_id}" && status = "confirmed" && user_id != ""`,
      fields: 'user_id',
    });

    const bookingParticipants = new Set(
      records
        .map((record: any) => String(record.user_id || ''))
        .filter(Boolean)
    );

    console.log('[contacts][getBookingParticipants] source=bookings-fallback', {
      offerId: booking.offer_id,
      recordsCount: records.length,
      participantIds: Array.from(bookingParticipants),
    });

    return bookingParticipants;
  } catch (err) {
    console.warn('[contacts][getBookingParticipants] bookings-fallback-failed', {
      offerId: booking.offer_id,
      err,
    });
    return new Set<string>();
  }
}

export async function getBookingsParticipants(bookings: Booking[]): Promise<Set<string>> {
  const participants = new Set<string>();

  for (const booking of bookings) {
    const bookingParticipants = await getBookingParticipants(booking);
    for (const participantId of bookingParticipants) {
      participants.add(participantId);
    }
  }

  return participants;
}

function addContactTrip(
  map: Map<string, Set<string>>,
  contactUserId: string,
  offerId: string
) {
  if (!map.has(contactUserId)) {
    map.set(contactUserId, new Set<string>());
  }
  map.get(contactUserId)!.add(offerId);
}

async function getUserContactTripMap(userId: string): Promise<Map<string, Set<string>>> {
  const bookings = await getUserConfirmedBookings(userId);

  console.log('[contacts][getUserContacts] user-trips', {
    userId,
    bookingsCount: bookings.length,
    tripIds: bookings.map((booking) => booking.offer_id),
  });

  if (bookings.length === 0) {
    return new Map<string, Set<string>>();
  }

  const [organizers, participants] = await Promise.all([
    getBookingsOrganizers(bookings),
    getBookingsParticipants(bookings),
  ]);

  console.log('[contacts][getUserContacts] trip-organizers', {
    userId,
    organizerIds: Array.from(organizers),
    organizersCount: organizers.size,
  });

  console.log('[contacts][getUserContacts] trip-members', {
    userId,
    participantIds: Array.from(participants),
    participantsCount: participants.size,
  });

  const contactTripMap = new Map<string, Set<string>>();

  for (const booking of bookings) {
    const offerId = booking.offer_id;
    if (!offerId) {
      continue;
    }

    const organizerId = await getBookingOrganizer(booking);
    if (organizerId && organizerId !== userId) {
      addContactTrip(contactTripMap, organizerId, offerId);
    }

    const bookingParticipants = await getBookingParticipants(booking);
    for (const participantId of bookingParticipants) {
      if (participantId !== userId) {
        addContactTrip(contactTripMap, participantId, offerId);
      }
    }
  }

  console.log('[contacts][getUserContacts] contact-trip-map', {
    userId,
    contactIds: Array.from(contactTripMap.keys()),
    pairs: Array.from(contactTripMap.entries()).map(([contactId, offerIds]) => ({
      contactId,
      offerIds: Array.from(offerIds),
    })),
  });

  return contactTripMap;
}

export async function getUserContacts(
  userId: string
): Promise<UserContact[]> {
  try {
    console.log('[contacts][getUserContacts] start', { userId });

    const contactTripMap = await getUserContactTripMap(userId);
    const contactIds = Array.from(contactTripMap.keys());

    if (contactIds.length === 0) {
      console.log('[contacts][getUserContacts] no-contacts', { userId });
      return [];
    }

    const allOfferIds = Array.from(
      new Set(
        Array.from(contactTripMap.values()).flatMap((offerIds) => Array.from(offerIds))
      )
    );

    const offers = await Promise.all(
      allOfferIds.map(async (offerId) => {
        const offer = await getOfferById(offerId);
        return {
          offerId,
          title: offer?.title || 'Rejs',
          date_from: offer?.date_from,
          date_to: offer?.date_to,
        };
      })
    );

    const offerById = new Map(
      offers.map((offer) => [offer.offerId, offer] as const)
    );

    const contacts = await Promise.all(
      contactIds.map(async (contactUserId) => {
        const tripIds = Array.from(contactTripMap.get(contactUserId) || []);
        const trips = tripIds
          .map((tripId) => offerById.get(tripId))
          .filter(Boolean)
          .map((trip) => ({
            offerId: trip!.offerId,
            title: trip!.title,
            date_from: trip!.date_from,
            date_to: trip!.date_to,
          }));

        try {
          const user = await pb.collection('users').getOne(contactUserId, {
            fields: 'id,name,email',
          });

          return {
            userId: String(user.id),
            name: String(user.name || user.email || 'Użytkownik'),
            trips,
          } as UserContact;
        } catch {
          return {
            userId: contactUserId,
            name: 'Użytkownik',
            trips,
          } as UserContact;
        }
      })
    );

    const sorted = contacts.sort((a, b) => a.name.localeCompare(b.name, 'pl'));

    console.log('[contacts][getUserContacts] resolved', {
      userId,
      contacts: sorted,
      contactsCount: sorted.length,
    });

    return sorted;
  } catch (err) {
    console.warn('getUserContacts error:', err);
    return [];
  }
}

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

  validateOwnOfferBooking(offer);
  validateSeatsAvailable(offer);

  const data = await buildBookingData(
    offerId,
    message,
    guestData
  );

  const record = await pb.collection(BOOKINGS_COLLECTION).create(data);

  const booking = mapRecordToBooking(record);

  await sendBookingEmails({
    offer,
    offerId,
    message,
    guestData,
    bookingRecipient: {
      email: booking.guest_email,
      name: booking.guest_name,
    },
  });

  return booking;
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  return listBookingsByFilter(`user_id = "${userId}"`);
}

export async function getOfferBookings(offerId: string): Promise<Booking[]> {
  return listBookingsByFilter(`offer_id = "${offerId}"`);
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<Booking> {
  const current = await pb.collection(BOOKINGS_COLLECTION).getOne(bookingId);
  const previousStatus = current.status as BookingStatus;

  console.log('[bookings][updateBookingStatus] start', {
    bookingId,
    offerId: current.offer_id,
    bookingUserId: current.user_id,
    previousStatus,
    newStatus: status,
  });

  if (previousStatus === status) {
    return mapRecordToBooking(current);
  }

  const offer = await getOfferById(current.offer_id);

  if (!offer) {
    throw new Error('Oferta nie istnieje');
  }

  if (status === 'confirmed' && previousStatus !== 'confirmed') {
    validateSeatsAvailable(offer);
  }

  const record = await pb.collection(BOOKINGS_COLLECTION).update(bookingId, {
    status,
  });

  const booking = mapRecordToBooking(record);

  await updateAvailableSeats({
    offer,
    previousStatus,
    newStatus: status,
    bookingUserId: current.user_id ? String(current.user_id) : undefined,
  });

  console.log('[bookings][updateBookingStatus] done', {
    bookingId,
    previousStatus,
    newStatus: status,
  });

  await sendBookingStatusEmail({
    booking: current,
    offer,
    status,
  });

  return booking;
}

// wyświetlamy na profilu użytkownika jego rezerwacje
// widok ten jest widoczny wyłącznie dla osoby, która wchodzi na swój profil
// (Sindbad/look/components/profile/UserProfile.tsx)
// możemy sobie potem filtrować po statusach rezerwacji
export async function getUserBookingsWithOffers(userId: string): Promise<BookingWithOffer[]> {
  // const records = pb.collection(BOOKINGS_COLLECTION).getFullList({
  //   filter: `user_id = "${userId}"`,
  //   expand: 'offer_id',
  // });

  // return (await records).map(record => ({
  //   id: record.id,
  //   user_id: record.user_id,
  //   status: record.status,
  //   offer_id: record.offer_id,
  //   message: record.message,
  //   guest_name: record.guest_name,
  //   guest_email: record.guest_email,
  //   guest_phone: record.guest_phone,
  //   created: record.created,
  //   updated: record.updated,

  //   offer: record.expand?.offer_id ?
  //   {
  //     id: record.expand.offer_id.id,
  //     title: record.expand.offer_id.title,
  //     date_from: record.expand.offer_id.date_from,
  //     date_to: record.expand.offer_id.date_to,
  //   } : undefined

  // }))
  const bookings = await getUserBookings(userId);

  return Promise.all(
    bookings.map(async (booking) => {
      const offer = await getOfferById(booking.offer_id);

      return {
        ...booking,
        offer: offer
          ? {
              id: offer.id,
              title: offer.title,
              date_from: offer.date_from,
              date_to: offer.date_to,
            }
          : undefined,
      };
    })
  );
}

// uczestników rejsu widzi
// 1. organizator
// 2. wspólny załogant (hasConfirmedBookingForOffer)
// oczywiscie musi być zalogowany
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