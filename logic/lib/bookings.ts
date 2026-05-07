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

export async function createBooking(
  offerId: string,
  message?: string
): Promise<Booking> {
  if (!pb.authStore.isValid) {
    throw new Error('Musisz być zalogowany');
  }

  const record = await pb.collection('bookings').create({
    offer_id: offerId,
    user_id: pb.authStore.record?.id,
    status: 'pending',
    message: message?.trim() || '',
  });

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