import request from 'supertest';
import { app } from '../../src/app';

describe('Review endpoints', () => {
  let cruiseId: string;

  beforeAll(async () => {
    // Dodaj rejs, żeby mieć cruiseId do opinii
    const cruiseRes = await request(app)
      .post('/api/cruises')
      .send({
        name: 'Rejs do testów opinii',
        description: 'Testowy rejs',
        date: '2025-09-01T10:00:00Z',
        location: 'Mazury',
        availableSeats: 5,
        organizerEmail: 'org@example.com'
      });
    cruiseId = cruiseRes.body.cruise.id;
  });

  it('powinien dodać opinię do rejsu', async () => {
    const res = await request(app)
      .post('/api/review')
      .send({
        cruiseId,
        userEmail: 'test@example.com',
        rating: 5,
        comment: 'Świetny rejs!'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Opinia dodana.');
    expect(res.body).toHaveProperty('review');
    expect(res.body.review).toHaveProperty('id');
  });

  it('nie powinien dodać opinii bez wymaganych pól', async () => {
    const res = await request(app)
      .post('/api/review')
      .send({
        cruiseId,
        rating: 4,
        comment: 'Brak emaila'
      });
    expect(res.statusCode).toEqual(400);
  });

  it('nie powinien dodać opinii z oceną spoza zakresu', async () => {
    const res = await request(app)
      .post('/api/review')
      .send({
        cruiseId,
        userEmail: 'test@example.com',
        rating: 10,
        comment: 'Za wysoka ocena'
      });
    expect(res.statusCode).toEqual(400);
  });

  it('powinien zwrócić listę opinii dla rejsu', async () => {
    const res = await request(app)
      .get(`/api/review/${cruiseId}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});