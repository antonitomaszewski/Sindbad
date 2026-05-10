import pb from './pocketbase';
import type { Booking, BookingStatus, BookingWithOffer } from '../types/booking';
import { getOfferById, validateSeatsAvailable } from './offers';
import { sendBookingStatusEmail, sendBookingEmails } from './emails';
import { RecordModel } from 'pocketbase';
import {updateAvailableSeats} from './offers';
import { Offer } from '../types/offer';
import { GuestBookingData } from '../types/booking';

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
  const isLoggedIn = pb.authStore.isValid;

  const data: any = {
    offer_id: offerId,
    status: 'pending',
    message: message?.trim() || '',
  };

  if (isLoggedIn) {
    data.user_id = pb.authStore.record?.id;

    return data;
  }

  data.guest_name = guestData?.name;
  data.guest_email = guestData?.email || '';
  data.guest_phone = guestData?.phone || '';

  return data;
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

  const record = await pb.collection('bookings').create(data);

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
  const records = await pb.collection('bookings').getFullList({
    filter: `user_id = "${userId}"`,
    sort: '-created',
  });

  return records.map(mapRecordToBooking);
}

export async function getOfferBookings(offerId: string): Promise<Booking[]> {
  const records = await pb.collection('bookings').getFullList({
    filter: `offer_id = "${offerId}"`,
    sort: '-created',
  });

  return records.map(mapRecordToBooking);
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<Booking> {
  const current = await pb.collection('bookings').getOne(bookingId);
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

  const record = await pb.collection('bookings').update(bookingId, {
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
    const [bookings1, bookings2] = await Promise.all([
      getUserBookings(userId1),
      getUserBookings(userId2),
    ]);

    const confirmedOfferIds1 = new Set(
      bookings1.filter((b) => b.status === 'confirmed').map((b) => b.offer_id)
    );

    return bookings2.some((b) => b.status === 'confirmed' && confirmedOfferIds1.has(b.offer_id));
  } catch (err) {
    console.warn('haveCommonBookings error:', err);
    return false;
  }
}