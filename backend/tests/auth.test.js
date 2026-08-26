jest.mock('../src/db', () => ({
  pool: { query: jest.fn() },
}));

const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes/auth');
const { pool } = require('../src/db');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

beforeEach(() => {
  process.env.JWT_SECRET = 'test-secret';
  pool.query.mockReset();
});

describe('POST /api/auth/register', () => {
  it('rejects a request missing required fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  it('rejects an invalid role', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'A',
      flat_no: 'B-101',
      phone: '9999999999',
      email: 'a@b.com',
      password: 'secret123',
      role: 'admin',
    });
    expect(res.status).toBe(400);
  });

  it('creates a pending user on valid input', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] }) // email not taken
      .mockResolvedValueOnce({
        rows: [{ id: 1, name: 'A', flat_no: 'B-101', phone: '9999999999', email: 'a@b.com', role: 'consumer', status: 'pending' }],
      });

    const res = await request(app).post('/api/auth/register').send({
      name: 'A',
      flat_no: 'B-101',
      phone: '9999999999',
      email: 'a@b.com',
      password: 'secret123',
      role: 'consumer',
    });

    expect(res.status).toBe(201);
    expect(res.body.user.status).toBe('pending');
    expect(res.body.token).toBeDefined();
  });
});

describe('POST /api/auth/login', () => {
  it('rejects missing credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('rejects unknown email', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).post('/api/auth/login').send({ email: 'x@y.com', password: 'secret123' });
    expect(res.status).toBe(401);
  });
});
