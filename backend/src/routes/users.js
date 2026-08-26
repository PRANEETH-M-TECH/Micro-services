const express = require('express');
const { pool } = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, flat_no, phone, email, role, status, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
});

module.exports = router;
