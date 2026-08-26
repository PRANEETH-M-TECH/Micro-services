const express = require('express');
const { pool } = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories
router.get('/', verifyToken, async (_req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM categories ORDER BY id');
    return res.status(200).json({ categories: result.rows });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
  }
});

module.exports = router;
