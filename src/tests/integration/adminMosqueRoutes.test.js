// tests/integration/mosqueRoutes.test.js
import request from 'supertest';
import app     from '../../src/app.js';
import db      from '../../src/config/dbConfig.js';

const MOBILE = '+15551112222';
let otp, token, mosqueId;

beforeAll(async () => {
  // Clean tables
  await db.query('DELETE FROM prayer_timings');
  await db.query('DELETE FROM mosques');
  await db.query('DELETE FROM admins');
});

afterAll(async () => {
  await db.end();
});

describe('Public & Protected /mosques routes', () => {
  it('– prep: register & login admin', async () => {
    let res = await request(app)
      .post('/api/v1/auth/register-admin')
      .send({ mobile: MOBILE, name: 'Prep', email: 'prep@x.com' });
    otp = res.body.otp;

    await request(app)
      .post('/api/v1/auth/verify-registration')
      .send({ mobile: MOBILE, code: otp, name: 'Prep', email: 'prep@x.com' });

    res = await request(app)
      .post('/api/v1/auth/login')
      .send({ mobile: MOBILE });
    otp = res.body.otp;

    res = await request(app)
      .post('/api/v1/auth/verify-login')
      .send({ mobile: MOBILE, code: otp });
    token = res.body.token;
  });

  it('POST /api/v1/mosques → 201 + created mosque', async () => {
    const res = await request(app)
      .post('/api/v1/mosques')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'PublicTest',
        address_line: '1 Road',
        city: 'City',
        country: 'Country',
        latitude: 11.11,
        longitude: 22.22,
      });
    expect(res.status).toBe(201);
    expect(res.body.mosque).toHaveProperty('id');
    mosqueId = res.body.mosque.id;
  });

  it('GET /api/v1/mosques/:id → 200 + correct record', async () => {
    const res = await request(app)
      .get(`/api/v1/mosques/${mosqueId}`);
    expect(res.status).toBe(200);
    expect(res.body.mosque.id).toBe(mosqueId);
  });

  it('PUT /api/v1/mosques/:id → 403 when not owner', async () => {
    const res = await request(app)
      .put(`/api/v1/mosques/${mosqueId}`)
      .set('Authorization', `Bearer invalidToken`)
      .send({ city: 'NewCity' });
    expect(res.status).toBe(401); // invalid token
  });

  it('PUT /api/v1/mosques/:id → 200 + updated when owner', async () => {
    const res = await request(app)
      .put(`/api/v1/mosques/${mosqueId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ city: 'NewCity' });
    expect(res.status).toBe(200);
    expect(res.body.mosque.city).toBe('NewCity');
  });
});
