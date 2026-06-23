import { describe, it, expect } from 'vitest';
import { validateOfferForm } from '../lib/validation';
import type { OfferFormData } from '../types/offer';

describe('validateOfferForm', () => {
  const validFormData: OfferFormData = {
    title: 'Test Rejs',
    description: 'Opis',
    date_from: new Date('2026-07-01'),
    date_to: new Date('2026-07-07'),
    country: 'Poland',
    port: 'Gdańsk',
    price_per_person: '500',
    currency: 'PLN',
    seats_total: '8',
    seats_available: '5',
    images: [],
    geo_lat: '0',
    geo_lon: '0',
    yacht_name: '',
  };

  describe('title validation', () => {
    it('should pass with valid title', () => {
      const errors = validateOfferForm(validFormData);
      expect(errors.title).toBeUndefined();
    });

    it('should fail when title is empty', () => {
      const errors = validateOfferForm({
        ...validFormData,
        title: '',
      });
      expect(errors.title).toBe('Tytuł jest wymagany');
    });

    it('should fail when title is too short', () => {
      const errors = validateOfferForm({
        ...validFormData,
        title: 'AB',
      });
      expect(errors.title).toBe('Tytuł musi mieć minimum 3 znaki');
    });

    it('should fail when title is too long', () => {
      const errors = validateOfferForm({
        ...validFormData,
        title: 'A'.repeat(101),
      });
      expect(errors.title).toBe('Tytuł może mieć maksymalnie 100 znaków');
    });
  });

  describe('date validation', () => {
    it('should fail when date_from is null', () => {
      const errors = validateOfferForm({
        ...validFormData,
        date_from: null,
      });
      expect(errors.date_from).toBe('Data rozpoczęcia jest wymagana');
    });

    it('should fail when date_from is in the past', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const errors = validateOfferForm({
        ...validFormData,
        date_from: yesterday,
      });
      expect(errors.date_from).toBe('Data rozpoczęcia nie może być w przeszłości');
    });

    it('should fail when date_to is before date_from', () => {
      const errors = validateOfferForm({
        ...validFormData,
        date_from: new Date('2026-07-07'),
        date_to: new Date('2026-07-01'),
      });
      expect(errors.date_to).toBe('Data zakończenia musi być po dacie rozpoczęcia');
    });

    it('should pass when dates are same day', () => {
      const sameDate = new Date('2026-07-15');
      const errors = validateOfferForm({
        ...validFormData,
        date_from: sameDate,
        date_to: sameDate,
      });
      expect(errors.date_to).toBeUndefined();
    });
  });

  describe('location validation', () => {
    it('should fail when country is empty', () => {
      const errors = validateOfferForm({
        ...validFormData,
        country: '',
      });
      expect(errors.country).toBe('Kraj jest wymagany');
    });

    it('should fail when port is empty', () => {
      const errors = validateOfferForm({
        ...validFormData,
        port: '',
      });
      expect(errors.port).toBe('Port jest wymagany');
    });

    it('should trim whitespace from country and port', () => {
      const errors = validateOfferForm({
        ...validFormData,
        country: '  Poland  ',
        port: '  Gdańsk  ',
      });
      expect(errors.country).toBeUndefined();
      expect(errors.port).toBeUndefined();
    });
  });

  describe('price validation', () => {
    it('should allow empty price', () => {
      const errors = validateOfferForm({
        ...validFormData,
        price_per_person: '',
      });
      expect(errors.price_per_person).toBeUndefined();
    });

    it('should fail when price is negative', () => {
      const errors = validateOfferForm({
        ...validFormData,
        price_per_person: '-100',
      });
      expect(errors.price_per_person).toBe('Cena nie może być ujemna');
    });
  });

  describe('seats validation', () => {
    it('should allow empty seats', () => {
      const errors = validateOfferForm({
        ...validFormData,
        seats_total: '',
        seats_available: '',
      });
      expect(errors.seats_total).toBeUndefined();
      expect(errors.seats_available).toBeUndefined();
    });

    it('should fail when seats_total is zero or negative', () => {
      let errors = validateOfferForm({
        ...validFormData,
        seats_total: '0',
      });
      expect(errors.seats_total).toBe('Liczba miejsc musi być większa od 0');

      errors = validateOfferForm({
        ...validFormData,
        seats_total: '-5',
      });
      expect(errors.seats_total).toBe('Liczba miejsc musi być większa od 0');
    });

    it('should fail when seats_available is negative', () => {
      const errors = validateOfferForm({
        ...validFormData,
        seats_available: '-1',
      });
      expect(errors.seats_available).toBe('Liczba wolnych miejsc nie może być ujemna');
    });

    it('should fail when seats_available > seats_total', () => {
      const errors = validateOfferForm({
        ...validFormData,
        seats_total: '5',
        seats_available: '8',
      });
      expect(errors.seats_available).toBe(
        'Liczba wolnych miejsc nie może być większa niż całkowita'
      );
    });
  });

  describe('image validation', () => {
    it('should pass with no images', () => {
      const errors = validateOfferForm({
        ...validFormData,
        images: [],
      });
      expect(errors.images).toBeUndefined();
    });

    it('should fail when image is too large (>5MB)', () => {
      const largeFile = new File(
        [new ArrayBuffer(6 * 1024 * 1024)], // 6MB
        'large.jpg',
        { type: 'image/jpeg' }
      );

      const errors = validateOfferForm({
        ...validFormData,
        images: [largeFile],
      });
      expect(errors.images).toContain('jest za duże');
      expect(errors.images).toContain('max 5MB');
    });

    it('should fail when file is not an image', () => {
      const textFile = new File(['content'], 'file.txt', {
        type: 'text/plain',
      });

      const errors = validateOfferForm({
        ...validFormData,
        images: [textFile],
      });
      expect(errors.images).toContain('nie jest zdjęciem');
    });
  });

  describe('complete form validation', () => {
    it('should return no errors for fully valid form', () => {
      const errors = validateOfferForm(validFormData);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('should return multiple errors for invalid form', () => {
      const errors = validateOfferForm({
        ...validFormData,
        title: '',
        date_from: null,
        country: '',
        port: '',
        seats_total: '-1',
        seats_available: '10',
      });

      expect(errors.title).toBeDefined();
      expect(errors.date_from).toBeDefined();
      expect(errors.country).toBeDefined();
      expect(errors.port).toBeDefined();
      expect(errors.seats_total).toBeDefined();
      expect(errors.seats_available).toBeDefined();
      expect(Object.keys(errors).length).toBe(6);
    });
  });
});