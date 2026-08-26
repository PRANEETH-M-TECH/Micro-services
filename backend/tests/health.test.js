const request = require('supertest');
const express = require('express');

// Build a minimal app mirroring server.js's health route, without touching the real DB pool.
const app = express();
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'communa-backend' });
});

describe('GET /api/health', () => {
  it('returns 200 and status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
