import pb from './pocketbase';
import type {
  Booking,
  BookingStatus,
  BookingWithOffer,
  GuestBookingData,
  OfferParticipant,
} from '../types/booking';
import { RecordModel } from 'pocketbase';
import { getOfferById, updateAvailableSeats, validateSeatsAvailable } from './offers';
import { sendBookingStatusEmail, sendBookingEmails } from './emails';
import { Offer } from '../types/offer';

const BOOKINGS_COLLECTION = 'bookings';

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

function validateBookingAccess(
  guestData?: GuestBookingData
) {
  const isLoggedIn = pb.authStore.isValid;

  if (!isLoggedIn && !guestData) {
    throw new Error(
      'Podaj dane kontaktowe lub zaloguj się'
    );
  }

  if (
    !isLoggedIn &&
    guestData &&
    !guestData.email &&
    !guestData.phone
  ) {
    throw new Error('Podaj email lub telefon');
  }
}

function validateOwnOfferBooking(offer: Offer) {
  if (!pb.authStore.isValid) {
    return;
  }

  if (offer.organizer_id === pb.authStore.record?.id) {
    throw new Error(
      'Nie możesz zarezerwować własnej oferty'
    );
  }
}

function buildBookingData(
  offerId: string,
  message?: string,
  guestData?: GuestBookingData
) {
  const data: any = {
    offer_id: offerId,
    status: 'pending',
    message: message?.trim() || '',
  };

  if (pb.authStore.isValid) {
    data.user_id = pb.authStore.record?.id;
    return data;
  }

  data.guest_name = guestData?.name;
  data.guest_email = guestData?.email || '';
  data.guest_phone = guestData?.phone || '';

  return data;
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

  const data = buildBookingData(
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
  });

  await sendBookingStatusEmail({
    booking: current,
    offer,
    status,
  });

  return booking;
}

export async function getUserBookingsWithOffers(userId: string): Promise<BookingWithOffer[]> {
  const bookings = await getUserBookings(userId);

  const withOffers = await Promise.all(
    bookings.map(async (booking) => {
      const offer = await getOfferById(booking.offer_id);
      return {
        ...booking,
        offer: offer
          ? { id: offer.id, title: offer.title, date_from: offer.date_from, date_to: offer.date_to }
          : undefined,
      };
    })
  );

  return withOffers;
}

/**
 * Sprawdź czy dwaj użytkownicy mają wspólne booking (uczestniczą w tej samej ofercie)
 */
export async function haveCommonBookings(userId1: string, userId2: string): Promise<boolean> {
  try {
    const [confirmedOfferIds1, confirmedOfferIds2] = await Promise.all([
      getConfirmedOfferIdsForUser(userId1),
      getConfirmedOfferIdsForUser(userId2),
    ]);

    return Array.from(confirmedOfferIds2).some((offerId) => confirmedOfferIds1.has(offerId));
  } catch (err) {
    console.warn('haveCommonBookings error:', err);
    return false;
  }
}

export async function canViewParticipants(
  offerId: string
): Promise<boolean> {
  const currentUserId = pb.authStore.record?.id;
  if (!currentUserId) return false;

  const offer = await getOfferById(offerId);
  if (!offer) return false;

  // organizer
  if (offer.organizer_id === currentUserId) {
    return true;
  }

  // confirmed booking
  return hasConfirmedBookingForOffer(offerId, currentUserId);
}

export async function getConfirmedParticipants(
  offerId: string
): Promise<OfferParticipant[]> {
  try {
    const records: any[] = await (pb.collection(BOOKINGS_COLLECTION) as any).getFullList({
      filter: `offer_id = "${offerId}" && status = "confirmed" && user_id != ""`,
      expand: 'user_id',
      sort: 'created',
    });

    const byUserId = new Map<string, OfferParticipant>();

    for (const record of records) {
      const expandedUser = Array.isArray(record.expand?.user_id)
        ? record.expand.user_id[0]
        : record.expand?.user_id;

      const userId = String(record.user_id || expandedUser?.id || '');
      if (!userId || byUserId.has(userId)) {
        continue;
      }

      byUserId.set(userId, {
        userId,
        name: String(expandedUser?.name || expandedUser?.email || 'Użytkownik'),
      });
    }

    return Array.from(byUserId.values());
  } catch (err) {
    console.warn('getConfirmedParticipants error:', err);
    return [];
  }
}