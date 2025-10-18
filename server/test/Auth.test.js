import request from 'supertest';
import { expect } from 'chai';

let app;

before(async () => {
  process.env.NODE_ENV = 'test';
  const candidates = [
    '../src/app.js',
    '../src/app/index.js',
    '../app.js',
    '../app/index.js',
    '../index.js'
  ];
  for (const p of candidates) {
    try {
      const mod = await import(p);
      app = mod.default ?? mod;
      if (app) break;
    } catch (e) {}
  }
  if (!app) throw new Error('Could not load app for testing');
});

describe('Auth API', () => {
  const testUser = {
    username: 'test_user_1',
    email: 'testuser1@example.com',
    password: 'password1234'
  };

  it('POST /api/auth/register -> registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect([200, 201]).to.include(res.status);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
  });

  it('POST /api/auth/register -> fails for duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message');
  });

  it('POST /api/auth/login -> logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('POST /api/auth/login -> fails with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message');
  });

  it('POST /api/auth/login -> fails with non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notfound@example.com', password: 'password1234' });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message');
  });
});