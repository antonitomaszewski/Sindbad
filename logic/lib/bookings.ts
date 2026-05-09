import pb from './pocketbase';
import type { Booking, BookingStatus, BookingWithOffer } from '../types/booking';
import { getOfferById, updateOffer } from './offers';
import { RecordModel } from 'pocketbase';

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

export interface GuestBookingData {
  name: string;
  email?: string;
  phone?: string;
}

export async function createBooking(
  offerId: string,
  message?: string,
  guestData?: GuestBookingData
): Promise<Booking> {
  const isLoggedIn = pb.authStore.isValid;

  if (!isLoggedIn && !guestData) {
    throw new Error('Podaj dane kontaktowe lub zaloguj się');
  }

  if (!isLoggedIn && guestData && !guestData.email && !guestData.phone) {
    throw new Error('Podaj email lub telefon');
  }

  // Organizator nie może rezerwować własnej oferty
  if (isLoggedIn) {
    const offer = await getOfferById(offerId);
    if (offer && offer.organizer_id === pb.authStore.record?.id) {
      throw new Error('Nie możesz zarezerwować własnej oferty');
    }
  }

  const data: any = {
    offer_id: offerId,
    status: 'pending',
    message: message?.trim() || '',
  };

  if (isLoggedIn) {
    data.user_id = pb.authStore.record?.id;
  } else if (guestData) {
    data.guest_name = guestData.name;
    data.guest_email = guestData.email || '';
    data.guest_phone = guestData.phone || '';
  }

  const record = await pb.collection('bookings').create(data);
  return mapRecordToBooking(record);
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

// Aktualizacja statusu rezerwacji (tylko organizator oferty - w pocketbase)
export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<Booking> {
  const current = await pb.collection('bookings').getOne(bookingId);
  const previousStatus = current.status as BookingStatus;

  const record = await pb.collection('bookings').update(bookingId, { status });

  // Aktualizuj licznik miejsc
  if (previousStatus !== status) {
    const offer = await getOfferById(current.offer_id);
    if (offer && offer.seats_available !== undefined) {
      if (status === 'confirmed' && previousStatus !== 'confirmed') {
        await updateOffer(offer.id, { seats_available: Math.max(0, offer.seats_available - 1) });
      }
    }
  }

  return mapRecordToBooking(record);
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

  const today = new Date().toISOString().slice(0, 10);
  return withOffers.filter((b) => !b.offer?.date_from || b.offer.date_from >= today);
}