import request from 'supertest';
import { app } from '../../src/app';

describe('User endpoints', () => {
  it('powinien zarejestrować nowego użytkownika', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        email: 'testuser@example.com',
        password: 'tajnehaslo'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Użytkownik zarejestrowany pomyślnie.');
  });

  it('nie powinien zarejestrować użytkownika bez emaila', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        password: 'tajnehaslo'
      });
    expect(res.statusCode).toEqual(400);
  });
});