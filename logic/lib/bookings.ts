import pb from './pocketbase';
import type { Booking, BookingStatus } from '../types/booking';
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