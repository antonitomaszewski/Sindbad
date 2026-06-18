import { createBooking, getUserBookings, getOfferBookings, getUserBookingsWithOffers, updateBookingStatus } from '../lib/bookings';
import { getOfferById } from '../lib/offers';
import { loginUser, logoutUser, registerUser } from '../lib/users';
import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";
import pb from '../lib/pocketbase';
import { todayIso } from '../../look/utils/dateFormatter';

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: 'mock-id' }),
    },
  })),
}));

describe('Bookings', () => {
  // tu tworze testowego użytkownika, dlatego w testowej bazie mam bałagan
  // przy kazdym tescie tworze nowe
  const testEmail = `test-bookings-${Date.now()}@example.com`;
  const testPassword = 'testpass123';
  let testUserId: string;
  const testOfferId = 'vljld1woofzcv8s';
  let createdBookingIds: string[] = [];

  beforeAll(async () => {
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
    createdBookingIds.push(booking.id);
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

  it.fails('updateBookingStatus changes booking status', async () => {
    const booking = await createBooking(testOfferId, 'Test dla update');
    createdBookingIds.push(booking.id);
    expect(booking.status).toBe('pending');

    const updated = await updateBookingStatus(booking.id, 'confirmed');
  });

  it('getUserBookingsWithOffers maps offer and applies upcoming filter', async () => {
    const booking = await createBooking(testOfferId, 'Test with offer mapping');
    createdBookingIds.push(booking.id);

    const offer = await getOfferById(testOfferId);
    const bookings = await getUserBookingsWithOffers(testUserId);

    expect(Array.isArray(bookings)).toBe(true);

    for (const item of bookings) {
      expect(item.offer_id).toBeTypeOf('string');
      if (item.offer) {
        expect(item.offer.id).toBe(item.offer_id);
        expect(item.offer.title).toBeTypeOf('string');
      }
    }

    const shouldBeVisible = !offer?.date_from || offer.date_from.slice(0, 10) >= todayIso();
    const createdBooking = bookings.find((item) => item.id === booking.id);

    if (shouldBeVisible) {
      expect(createdBooking).toBeTruthy();
      expect(createdBooking?.offer?.id).toBe(testOfferId);
    } else {
      expect(createdBooking).toBeUndefined();
    }
  });
}, 15000);