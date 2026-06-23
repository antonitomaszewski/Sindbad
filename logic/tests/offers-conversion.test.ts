import { describe, it, expect, vi } from 'vitest';
import { convertFormDataToOffer } from '../lib/offers';
import type { OfferFormData } from '../types/offer';

vi.mock('../lib/emails', () => ({
  sendBookingEmails: vi.fn().mockResolvedValue(undefined),
  sendBookingStatusEmail: vi.fn().mockResolvedValue(undefined),
}));

describe('convertFormDataToOffer', () => {
  const fullFormData: OfferFormData = {
    title: 'Test Rejs',
    description: 'Opis rejsu',
    date_from: new Date('2026-07-15T10:00:00Z'),
    date_to: new Date('2026-07-22T18:00:00Z'),
    country: 'Poland',
    port: 'Gdańsk',
    price_per_person: '500.50',
    currency: 'PLN',
    seats_total: '8',
    seats_available: '5',
    images: [],
    geo_lat: '0',
    geo_lon: '0',
    yacht_name: 'dsa'
  };

  const organizerId = 'user123';

  describe('required fields conversion', () => {
    it('should convert all required fields correctly', () => {
      const result = convertFormDataToOffer(fullFormData, organizerId);

      expect(result.organizer_id).toBe('user123');
      expect(result.title).toBe('Test Rejs');
      expect(result.date_from).toBe('2026-07-15');
      expect(result.date_to).toBe('2026-07-22');
      expect(result.country).toBe('Poland');
      expect(result.port).toBe('Gdańsk');
      expect(result.currency).toBe('PLN');
    });
  });

  describe('optional fields conversion', () => {
    it('should include description when provided', () => {
      const result = convertFormDataToOffer(fullFormData, organizerId);
      expect(result.description).toBe('Opis rejsu');
    });

    it('should exclude description when empty', () => {
      const data = { ...fullFormData, description: '' };
      const result = convertFormDataToOffer(data, organizerId);
      expect(result.description).toBeUndefined();
    });

    it('should convert price to number', () => {
      const result = convertFormDataToOffer(fullFormData, organizerId);
      expect(result.price_per_person).toBe(500.50);
      expect(typeof result.price_per_person).toBe('number');
    });

    it('should exclude price when empty', () => {
      const data = { ...fullFormData, price_per_person: '' };
      const result = convertFormDataToOffer(data, organizerId);
      expect(result.price_per_person).toBeUndefined();
    });

    it('should convert seats to numbers', () => {
      const result = convertFormDataToOffer(fullFormData, organizerId);
      expect(result.seats_total).toBe(8);
      expect(result.seats_available).toBe(5);
      expect(typeof result.seats_total).toBe('number');
      expect(typeof result.seats_available).toBe('number');
    });

    it('should exclude seats when empty', () => {
      const data = {
        ...fullFormData,
        seats_total: '',
        seats_available: '',
      };
      const result = convertFormDataToOffer(data, organizerId);
      expect(result.seats_total).toBeUndefined();
      expect(result.seats_available).toBeUndefined();
    });
  });

  describe('string trimming', () => {
    it('should trim whitespace from title', () => {
      const data = { ...fullFormData, title: '  Test Rejs  ' };
      const result = convertFormDataToOffer(data, organizerId);
      expect(result.title).toBe('Test Rejs');
    });

    it('should trim whitespace from description', () => {
      const data = { ...fullFormData, description: '  Opis rejsu  ' };
      const result = convertFormDataToOffer(data, organizerId);
      expect(result.description).toBe('Opis rejsu');
    });

    it('should trim whitespace from port', () => {
      const data = { ...fullFormData, port: '  Gdańsk  ' };
      const result = convertFormDataToOffer(data, organizerId);
      expect(result.port).toBe('Gdańsk');
    });
  });

  describe('minimal form data', () => {
    it('should handle form with only required fields', () => {
      const minimalData: OfferFormData = {
        title: 'Minimal Rejs',
        description: '',
        date_from: new Date('2026-08-01'),
        date_to: new Date('2026-08-07'),
        country: 'Croatia',
        port: 'Split',
        price_per_person: '',
        currency: 'EUR',
        seats_total: '',
        seats_available: '',
        images: [],
        geo_lat: '0',
        geo_lon: '0',
        yacht_name: 'dsa'
      };

      const result = convertFormDataToOffer(minimalData, organizerId);

      expect(result).toEqual({
        organizer_id: 'user123',
        title: 'Minimal Rejs',
        date_from: '2026-08-01',
        date_to: '2026-08-07',
        country: 'Croatia',
        port: 'Split',
        currency: 'EUR',
        geo: {
          lat: 0,
          lon: 0
        },
        yacht_name: 'dsa'
      });
    });
  });

  describe('edge cases', () => {
    it('should handle zero price', () => {
      const data = { ...fullFormData, price_per_person: '0' };
      const result = convertFormDataToOffer(data, organizerId);
      expect(result.price_per_person).toBe(0);
    });

    it('should handle different currencies', () => {
      const currencies: Array<'PLN' | 'EUR' | 'USD'> = ['PLN', 'EUR', 'USD'];
      
      currencies.forEach((currency) => {
        const data = { ...fullFormData, currency };
        const result = convertFormDataToOffer(data, organizerId);
        expect(result.currency).toBe(currency);
      });
    });
  });
});