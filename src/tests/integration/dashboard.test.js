import request from 'supertest';
import app     from '../../src/app.js';
import db      from '../../src/config/dbConfig.js';

const MOBILE            = '+15554445555';
const BACKOFFICE_SECRET = 'test-backoffice-secret';
let otp, token, mosqueId;

beforeAll(async () => {
  process.env.BACKOFFICE_SECRET = BACKOFFICE_SECRET;
  await db.query('DELETE FROM mosque_facilities');
  await db.query('DELETE FROM facilities');
  await db.query('DELETE FROM prayer_timings');
  await db.query('DELETE FROM mosques');
  await db.query('DELETE FROM admins');

  // Seed some facilities options
  await db.query(`INSERT INTO facilities (id, name) VALUES
    ('1','WiFi'),('2','Parking'),('3','Wudu Area')`);
});

afterAll(async () => {
  await db.end();
});

describe('Admin Dashboard (/api/v1/admin/mosque)', () => {
  it('— prep: full flow up to approved', async () => {
    // Register & verify
    let res = await request(app)
      .post('/api/v1/auth/register-admin')
      .send({ mobile: MOBILE, name: 'Dash', email: 'dash@x.com' });
    otp = res.body.otp;
    await request(app)
      .post('/api/v1/auth/verify-registration')
      .send({ mobile: MOBILE, code: otp, name: 'Dash', email: 'dash@x.com' });

    // Login & verify
    res = await request(app)
      .post('/api/v1/auth/login')
      .send({ mobile: MOBILE });
    otp = res.body.otp;
    res = await request(app)
      .post('/api/v1/auth/verify-login')
      .send({ mobile: MOBILE, code: otp });
    token = res.body.token;

    // Create mosque
    res = await request(app)
      .post('/api/v1/mosques')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name:'Dash Mosque', address_line:'1 Dash St',
        city:'Dashville', country:'Dashland', latitude:1, longitude:1
      });
    mosqueId = res.body.mosque.id;

    // Approve it
    await request(app)
      .put('/api/v1/admin/mosque/status')
      .set('x-backoffice-secret', BACKOFFICE_SECRET)
      .send({ id: mosqueId, status:'approved' });

    // Complete profile
    await request(app)
      .put(`/api/v1/mosques/${mosqueId}/profile`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description:'A dashboard test mosque',
        contact_phone:'+123456',
        facilityIds:['1','2']
      });

    // Set prayer times
    await request(app)
      .put(`/api/v1/mosques/${mosqueId}/prayer-times`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        fajr:'05:00', dhuhr:'12:00', asr:'15:00',
        maghrib:'18:00', isha:'20:00'
      });

    // Final complete
    await request(app)
      .post(`/api/v1/mosques/${mosqueId}/complete`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('GET /api/v1/admin/mosque → full dashboard', async () => {
    const res = await request(app)
      .get('/api/v1/admin/mosque')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    // Core mosque fields
    expect(res.body.mosque).toMatchObject({
      id: mosqueId,
      name: 'Dash Mosque',
      status: 'approved',
      is_mosque_approved: true,
    });

    // Profile block
    expect(res.body.profile).toMatchObject({
      description: 'A dashboard test mosque',
      contact_phone: '+123456',
    });
    expect(res.body.profile.facilities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '1', name: 'WiFi' }),
        expect.objectContaining({ id: '2', name: 'Parking' }),
      ])
    );

    // Prayer timings block
    expect(res.body.prayerTimings).toMatchObject({
      fajr:'05:00', dhuhr:'12:00', asr:'15:00',
      maghrib:'18:00', isha:'20:00'
    });
  });
});
