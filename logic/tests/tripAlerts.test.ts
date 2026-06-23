import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import {
  createTripAlert,
  getUserTripAlerts,
  deleteTripAlert,
  doesAlertMatchOffer,
  findMatchingAlerts,
  sendTripAlertNotifications,
} from '../lib/tripAlerts';
import { createOffer } from '../lib/offers';
import { registerUser, loginUser, logoutUser } from '../lib/users';
import type { TripAlert } from '../types/tripAlert';
import type { Offer } from '../types/offer';
import pb from '../lib/pocketbase';
import { formatDate } from '../../look/utils/dateFormatter';

vi.mock('../lib/emails', () => ({
  sendBookingEmails: vi.fn().mockResolvedValue(undefined),
  sendBookingStatusEmail: vi.fn().mockResolvedValue(undefined),
}));


describe('Trip Alerts', () => {
  let userId1: string;
  let userId2: string;
  let organizerId: string;
  const email1 = `alert-test-${Date.now()}@example.com`;
  const email2 = `alert-test-${Date.now() + 1}@example.com`;
  const organizerEmail = `organizer-${Date.now()}@example.com`;
  const password = 'testpass123';
  const testGeo = { lat: 54.352, lon: 18.6466 };

  let createdAlertIds: string[] = [];
  let createdOfferIds: string[] = [];

  beforeAll(async () => {
    // Zarejestruj testowych użytkowników
    const user1 = await registerUser(email1, password, password, 'Alert User 1');
    userId1 = user1.id;

    const user2 = await registerUser(email2, password, password, 'Alert User 2');
    userId2 = user2.id;

    const organizer = await registerUser(organizerEmail, password, password, 'Trip Organizer');
    organizerId = organizer.id;

    await loginUser(organizerEmail, password);
  }, 15000);

  afterAll(async () => {
    // Cleanup: usuń utworzone alerty
    for (const id of createdAlertIds) {
      try {
        await pb.collection('trip_alerts').delete(id);
      } catch (e) {
        // ignore
      }
    }

    // Cleanup: usuń utworzone oferty
    for (const id of createdOfferIds) {
      try {
        await pb.collection('offers').delete(id);
      } catch (e) {
        // ignore
      }
    }

    logoutUser();
  });

  describe('doesAlertMatchOffer - pure matching logic', () => {
    const baseAlert: TripAlert = {
      id: 'test-1',
      user_id: 'test-user',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    const baseOffer: Offer = {
      id: 'test-offer',
      organizer_id: 'org-1',
      title: 'Test Trip',
      country: 'Poland',
      date_from: '2026-07-01',
      date_to: '2026-07-07',
      port: 'Gdańsk',
      price_per_person: 500,
      currency: 'PLN',
      seats_total: 10,
      seats_available: 5,
      description: 'Test',
      location: 'Test location',
      geo: testGeo,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    it('matches when all fields are empty (no constraints)', () => {
      const alert: TripAlert = { ...baseAlert };
      const offer: Offer = { ...baseOffer };
      expect(doesAlertMatchOffer(alert, offer)).toBe(true);
    });

    it('matches when country matches', () => {
      const alert: TripAlert = { ...baseAlert, country: 'Poland' };
      const offer: Offer = { ...baseOffer, country: 'Poland' };
      expect(doesAlertMatchOffer(alert, offer)).toBe(true);
    });

    it('does not match when country differs', () => {
      const alert: TripAlert = { ...baseAlert, country: 'Poland' };
      const offer: Offer = { ...baseOffer, country: 'France' };
      expect(doesAlertMatchOffer(alert, offer)).toBe(false);
    });

    it('ignores country constraint when alert country is empty', () => {
      const alert: TripAlert = { ...baseAlert, country: undefined };
      const offer: Offer = { ...baseOffer, country: 'France' };
      expect(doesAlertMatchOffer(alert, offer)).toBe(true);
    });

    it('matches when organizer matches', () => {
      const alert: TripAlert = { ...baseAlert, organizer_id: 'org-1' };
      const offer: Offer = { ...baseOffer, organizer_id: 'org-1' };
      expect(doesAlertMatchOffer(alert, offer)).toBe(true);
    });

    it('does not match when organizer differs', () => {
      const alert: TripAlert = { ...baseAlert, organizer_id: 'org-1' };
      const offer: Offer = { ...baseOffer, organizer_id: 'org-2' };
      expect(doesAlertMatchOffer(alert, offer)).toBe(false);
    });

    it('ignores organizer constraint when alert organizer is empty', () => {
      const alert: TripAlert = { ...baseAlert, organizer_id: undefined };
      const offer: Offer = { ...baseOffer, organizer_id: 'org-999' };
      expect(doesAlertMatchOffer(alert, offer)).toBe(true);
    });

    it('matches when dates overlap - alert fully contains offer', () => {
      const alert: TripAlert = {
        ...baseAlert,
        date_from: '2026-06-01',
        date_to: '2026-08-01',
      };
      const offer: Offer = {
        ...baseOffer,
        date_from: '2026-07-01',
        date_to: '2026-07-07',
      };
      expect(doesAlertMatchOffer(alert, offer)).toBe(true);
    });

    it('matches when dates overlap - offer fully contains alert', () => {
      const alert: TripAlert = {
        ...baseAlert,
        date_from: '2026-07-01',
        date_to: '2026-07-07',
      };
      const offer: Offer = {
        ...baseOffer,
        date_from: '2026-06-01',
        date_to: '2026-08-01',
      };
      expect(doesAlertMatchOffer(alert, offer)).toBe(true);
    });

    it('matches when dates partially overlap', () => {
      const alert: TripAlert = {
        ...baseAlert,
        date_from: '2026-07-05',
        date_to: '2026-07-15',
      };
      const offer: Offer = {
        ...baseOffer,
        date_from: '2026-07-01',
        date_to: '2026-07-10',
      };
      expect(doesAlertMatchOffer(alert, offer)).toBe(true);
    });

    it('does not match when dates do not overlap - alert after offer', () => {
      const alert: TripAlert = {
        ...baseAlert,
        date_from: '2026-08-01',
        date_to: '2026-08-07',
      };
      const offer: Offer = {
        ...baseOffer,
        date_from: '2026-07-01',
        date_to: '2026-07-07',
      };
      expect(doesAlertMatchOffer(alert, offer)).toBe(false);
    });

    it('does not match when dates do not overlap - alert before offer', () => {
      const alert: TripAlert = {
        ...baseAlert,
        date_from: '2026-06-01',
        date_to: '2026-06-07',
      };
      const offer: Offer = {
        ...baseOffer,
        date_from: '2026-07-01',
        date_to: '2026-07-07',
      };
      expect(doesAlertMatchOffer(alert, offer)).toBe(false);
    });

    it('ignores date constraint when alert dates are empty', () => {
      const alert: TripAlert = { ...baseAlert, date_from: undefined, date_to: undefined };
      const offer: Offer = {
        ...baseOffer,
        date_from: '2026-09-01',
        date_to: '2026-09-07',
      };
      expect(doesAlertMatchOffer(alert, offer)).toBe(true);
    });

    it('matches when multiple constraints are satisfied', () => {
      const alert: TripAlert = {
        ...baseAlert,
        country: 'Poland',
        organizer_id: 'org-1',
        date_from: '2026-07-01',
        date_to: '2026-07-07',
      };
      const offer: Offer = {
        ...baseOffer,
        country: 'Poland',
        organizer_id: 'org-1',
        date_from: '2026-07-02',
        date_to: '2026-07-05',
      };
      expect(doesAlertMatchOffer(alert, offer)).toBe(true);
    });

    it('does not match when one constraint fails among multiple', () => {
      const alert: TripAlert = {
        ...baseAlert,
        country: 'Poland',
        organizer_id: 'org-1',
        date_from: '2026-07-01',
        date_to: '2026-07-07',
      };
      const offer: Offer = {
        ...baseOffer,
        country: 'France', // Different country
        organizer_id: 'org-1',
        date_from: '2026-07-02',
        date_to: '2026-07-05',
      };
      expect(doesAlertMatchOffer(alert, offer)).toBe(false);
    });
  });

  describe('CRUD operations', () => {
    it('createTripAlert creates a new alert', async () => {
      const alert = await createTripAlert(userId1, {
        country: 'Poland',
        date_from: '2026-07-01',
        date_to: '2026-08-01',
      });

      createdAlertIds.push(alert.id);
      expect(alert.user_id).toBe(userId1);
      expect(alert.country).toBe('Poland');
      expect(formatDate(alert.date_from)).toBe('01.07.2026');
      expect(formatDate(alert.date_to)).toBe('01.08.2026');
    });

    it('getUserTripAlerts returns user alerts', async () => {
      const alert1 = await createTripAlert(userId1, { country: 'Poland' });
      createdAlertIds.push(alert1.id);

      const alert2 = await createTripAlert(userId1, { country: 'France' });
      createdAlertIds.push(alert2.id);

      const alerts = await getUserTripAlerts(userId1);
      expect(Array.isArray(alerts)).toBe(true);
      expect(alerts.length).toBeGreaterThanOrEqual(2);
      expect(alerts.some((a) => a.id === alert1.id)).toBe(true);
      expect(alerts.some((a) => a.id === alert2.id)).toBe(true);
    });

    it('getUserTripAlerts returns empty array for user with no alerts', async () => {
      const alerts = await getUserTripAlerts(userId2);
      expect(Array.isArray(alerts)).toBe(true);
    });

    it('deleteTripAlert removes an alert', async () => {
      const alert = await createTripAlert(userId1, { country: 'Spain' });
      const alertId = alert.id;

      await deleteTripAlert(alertId);

      const alerts = await getUserTripAlerts(userId1);
      expect(alerts.some((a) => a.id === alertId)).toBe(false);
    });
  });

  describe('findMatchingAlerts', () => {
    it('finds alerts matching an offer', async () => {
      // Create alert
      const alert = await createTripAlert(userId1, {
        country: 'Poland',
        date_from: '2026-07-01',
        date_to: '2026-08-01',
      });
      createdAlertIds.push(alert.id);

      // Create matching offer
      const offer = await createOffer({
        organizer_id: organizerId,
        title: 'Poland Trip',
        description: 'Test',
        country: 'Poland',
        port: 'Gdańsk',
        date_from: '2026-07-15',
        date_to: '2026-07-20',
        price_per_person: 500,
        currency: 'PLN',
        seats_total: 8,
        seats_available: 5,
        location: 'Gdańsk',
        geo: testGeo,
      });
      createdOfferIds.push(offer.id);

      const matchingAlerts = await findMatchingAlerts(offer);
      expect(Array.isArray(matchingAlerts)).toBe(true);
      expect(matchingAlerts.some((a) => a.id === alert.id)).toBe(true);
    });

    it('does not find alerts that do not match', async () => {
      const alert = await createTripAlert(userId1, {
        country: 'France',
        date_from: '2026-09-01',
        date_to: '2026-09-30',
      });
      createdAlertIds.push(alert.id);

      // Create non-matching offer
      const offer = await createOffer({
        organizer_id: organizerId,
        title: 'Poland Trip',
        description: 'Test',
        country: 'Poland',
        port: 'Gdańsk',
        date_from: '2026-07-01',
        date_to: '2026-07-07',
        price_per_person: 500,
        currency: 'PLN',
        seats_total: 8,
        seats_available: 5,
        location: 'Gdańsk',
        geo: testGeo,
      });
      createdOfferIds.push(offer.id);

      const matchingAlerts = await findMatchingAlerts(offer);
      expect(matchingAlerts.some((a) => a.id === alert.id)).toBe(false);
    });
  });

  describe('sendTripAlertNotifications', () => {
    it('sends notifications to matching alerts', async () => {
      const alert = await createTripAlert(userId1, {
        country: 'Poland',
        date_from: '2026-07-01',
        date_to: '2026-08-01',
      });
      createdAlertIds.push(alert.id);

      const offer = await createOffer({
        organizer_id: organizerId,
        title: 'Poland Vacation',
        description: 'Test',
        country: 'Poland',
        port: 'Gdańsk',
        date_from: '2026-07-15',
        date_to: '2026-07-20',
        price_per_person: 500,
        currency: 'PLN',
        seats_total: 8,
        seats_available: 5,
        location: 'Gdańsk',
        geo: testGeo,
      });
      createdOfferIds.push(offer.id);

      // This should not throw
      await expect(
        sendTripAlertNotifications(offer)
      ).resolves.not.toThrow();
    });
  });
});
