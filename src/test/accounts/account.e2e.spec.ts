import express from 'express';
import request from 'supertest';

import { V1AccountController } from '../../accounts/account.controller';

describe('GET /v1/accounts/:id', () => {
  it('returns the serialized account payload', async () => {
    const accountService = {
      findOneAccountById: jest.fn().mockResolvedValue({
        id: 1,
        name: 'josh',
        gender: 'MALE',
        email: 'example@mail.com',
        language: 'Japanese',
        area: 'Asia',
        country: 'Japan',
        roles: [1, 2, 3],
      }),
    } as any;
    const controller = new V1AccountController(accountService);
    const app = express();

    app.get('/v1/accounts/:id', async (req, res, next) => {
      try {
        res.json(await controller.findAccountById(req));
      } catch (error) {
        next(error);
      }
    });

    const response = await request(app)
      .get('/v1/accounts/1')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe('josh');
  });
});
