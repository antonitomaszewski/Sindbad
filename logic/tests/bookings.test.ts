import { createBooking, getUserBookings, getOfferBookings, updateBookingStatus } from '../lib/bookings';
import { loginUser, logoutUser, registerUser } from '../lib/users';
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import pb from '../lib/pocketbase';

describe('Bookings', () => {
  const testEmail = `test-bookings-${Date.now()}@example.com`;
  const testPassword = 'testpass123';
  let testUserId: string;
  const testOfferId = 'vljld1woofzcv8s'; // Możesz stworzyć prawdziwą ofertę albo użyć istniejącą
  let createdBookingIds: string[] = [];

  beforeAll(async () => {
    // Zarejestruj i zaloguj testowego użytkownika
    const user = await registerUser(testEmail, testPassword, testPassword, 'Test User');
    testUserId = user.id;
    await loginUser(testEmail, testPassword);
  }, 10000);

  afterAll(async () => {
    // Usuń utworzone bookings
    // (obecnie nie działa, bo mamy delete jedynie dla SUpersuera)
    for (const id of createdBookingIds) {
      try {
        await pb.collection('bookings').delete(id);
      } catch (e) {
        // Ignoruj błędy (booking może już nie istnieć)
      }
    }
    logoutUser();
  });

  it('createBooking creates a booking', async () => {
    const booking = await createBooking(testOfferId, 'Test message');
    createdBookingIds.push(booking.id); // Zapisz ID
    expect(booking.status).toBe('pending');
    expect(booking.user_id).toBe(testUserId);
    expect(booking.offer_id).toBe(testOfferId);
  });

  it('getUserBookings returns user bookings', async () => {
    const bookings = await getUserBookings(testUserId);
    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);
  });

  it('getOfferBookings returns offer bookings', async () => {
    const bookings = await getOfferBookings(testOfferId);
    expect(Array.isArray(bookings)).toBe(true);
  });

  it('updateBookingStatus changes booking status', async () => {
    const booking = await createBooking(testOfferId, 'Test dla update');
    createdBookingIds.push(booking.id);
    expect(booking.status).toBe('pending');

    const updated = await updateBookingStatus(booking.id, 'confirmed');
    expect(updated.status).toBe('confirmed');

    const cancelled = await updateBookingStatus(booking.id, 'cancelled');
    expect(cancelled.status).toBe('cancelled');
  });
}, 15000);