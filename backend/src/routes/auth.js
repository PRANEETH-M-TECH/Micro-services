const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, status: user.status, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, flat_no, phone, email, password, role } = req.body;

  if (!name || !flat_no || !phone || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (!['consumer', 'seller'].includes(role)) {
    return res.status(400).json({ message: 'Role must be consumer or seller' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, flat_no, phone, email, password_hash, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id, name, flat_no, phone, email, role, status, created_at`,
      [name, flat_no, phone, email, passwordHash, role]
    );

    const user = result.rows[0];
    return res.status(201).json({ user, token: signToken(user) });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { password_hash, ...safeUser } = user;
    return res.status(200).json({ user: safeUser, token: signToken(user) });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;
