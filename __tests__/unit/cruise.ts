import request from 'supertest';
import { app } from '../../src/app';

describe('Cruise endpoints', () => {
  it('powinien dodać nowy rejs', async () => {
    const res = await request(app)
      .post('/api/cruises')
      .send({
        name: 'Mazury Tour',
        description: 'Rejs po Mazurach',
        date: '2025-07-01T10:00:00Z',
        location: 'Mazury',
        availableSeats: 10,
        organizerEmail: 'org@example.com'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Rejs dodany pomyślnie.');
    expect(res.body).toHaveProperty('cruise');
    expect(res.body.cruise).toHaveProperty('id');
  });

  it('nie powinien dodać rejsu bez wymaganych pól', async () => {
    const res = await request(app)
      .post('/api/cruises')
      .send({
        name: 'Brakujące dane'
        // brak innych wymaganych pól
      });
    expect(res.statusCode).toEqual(400);
  });

  it('powinien zwrócić listę rejsów', async () => {
    const res = await request(app)
      .get('/api/cruises');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});