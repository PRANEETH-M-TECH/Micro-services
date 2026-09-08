// Loads the repo-root .env regardless of CWD, so `npm run dev` from backend/
// picks up the same file docker-compose uses. Inside Docker there's no .env
// file at all (env vars come from docker-compose's `environment:` block
// directly) — dotenv just silently no-ops if the path doesn't exist.
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { pool } = require('./db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const sellerRoutes = require('./routes/sellers');
const adminRoutes = require('./routes/admin');
const searchRoutes = require('./routes/search');
const aiRoutes = require('./routes/ai');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'communa-backend', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai', aiRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Not found' }));

async function ensureBootstrapAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO users (name, flat_no, phone, email, password_hash, role, status)
     VALUES ($1, 'ADMIN', '0000000000', $2, $3, 'admin', 'approved')`,
    [process.env.ADMIN_NAME || 'Society Admin', email, passwordHash]
  );
  console.log(`Bootstrap admin created: ${email}`);
}

async function start() {
  const port = process.env.PORT || 4000;
  const maxRetries = 10;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await pool.query('SELECT 1');
      break;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      console.log(`Waiting for database... (${attempt}/${maxRetries})`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  await ensureBootstrapAdmin();

  app.listen(port, () => console.log(`Communa backend listening on port ${port}`));
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
