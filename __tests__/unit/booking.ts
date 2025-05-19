import request from 'supertest';
import { app } from '../../src/app';

jest.mock('../../src/utils/emailService', () => ({
  sendEmail: jest.fn(),
}));

import { sendEmail } from '../../src/utils/emailService';

describe('Booking email notification', () => {
  let cruiseId: string;

  beforeAll(async () => {
    // Tworzymy rejs do testu
    const cruiseRes = await request(app)
      .post('/api/cruises')
      .send({
        name: 'Testowy rejs do powiadomień',
        description: 'Opis',
        date: '2025-10-01T12:00:00Z',
        location: 'Mazury',
        availableSeats: 5,
        organizerEmail: 'org@example.com'
      });
    cruiseId = cruiseRes.body.cruise.id;
  });

  it('powinien wywołać sendEmail po utworzeniu rezerwacji', async () => {
    await request(app)
      .post('/api/bookings')
      .send({
        cruiseId,
        userEmail: 'test@example.com',
        seats: 1
      });

    expect(sendEmail).toHaveBeenCalledWith(
      'test@example.com',
      'Potwierdzenie rezerwacji',
      expect.stringContaining('Twoja rezerwacja na rejs')
    );
  });
});

describe('Booking endpoints', () => {
  let cruiseId: string;

  beforeAll(async () => {
    // Najpierw dodaj rejs, żeby mieć prawidłowe cruiseId do rezerwacji
    const cruiseRes = await request(app)
      .post('/api/cruises')
      .send({
        name: 'Testowy rejs',
        description: 'Opis testowego rejsu',
        date: '2025-08-01T12:00:00Z',
        location: 'Bałtyk',
        availableSeats: 5,
        organizerEmail: 'org@example.com'
      });
    cruiseId = cruiseRes.body.cruise.id;
  });

  it('powinien utworzyć rezerwację', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({
        cruiseId,
        userEmail: 'test@example.com',
        seats: 2
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Rezerwacja utworzona.');
    expect(res.body).toHaveProperty('booking');
    expect(res.body.booking).toHaveProperty('id');
  });

  it('nie powinien utworzyć rezerwacji bez wymaganych pól', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({
        cruiseId,
        seats: 1
        // brak userEmail
      });
    expect(res.statusCode).toEqual(400);
  });

  it('nie powinien utworzyć rezerwacji jeśli nie ma wystarczającej liczby miejsc', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({
        cruiseId,
        userEmail: 'test@example.com',
        seats: 100 // więcej niż dostępnych miejsc
      });
    expect(res.statusCode).toEqual(400);
  });
});