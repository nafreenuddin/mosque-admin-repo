// tests/integration/versioning.test.js
import request from 'supertest';
import app     from '../../src/app.js';

describe('API Versioning & Legacy Coverage', () => {
  it('POST /api/v1/auth/login should NOT return 404', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ mobile: '+10000000000' });
    expect(res.status).not.toBe(404);
  });

  it('POST /api/auth/login should NOT return 404 (legacy)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ mobile: '+10000000000' });
    expect(res.status).not.toBe(404);
  });

  it('POST /api/v2/auth/login should return 404 (no v2)', async () => {
    const res = await request(app)
      .post('/api/v2/auth/login')
      .send({ mobile: '+10000000000' });
    expect(res.status).toBe(404);
  });
});
