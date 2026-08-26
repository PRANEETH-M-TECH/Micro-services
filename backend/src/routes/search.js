const express = require('express');
const { pool } = require('../db');
const { verifyToken } = require('../middleware/auth');
const { searchSellers } = require('../services/gemini');

const router = express.Router();

// POST /api/search  { query: "someone who delivers milk daily" }
router.post('/', verifyToken, async (req, res) => {
  const { query } = req.body;
  if (!query || !query.trim()) {
    return res.status(400).json({ message: 'query is required' });
  }

  try {
    const approved = await pool.query(
      `SELECT s.id, s.title, s.description, s.price_range, s.contact_number, s.status, s.created_at,
              c.name AS category, u.name AS seller_name, u.flat_no
       FROM sellers s
       JOIN categories c ON c.id = s.category_id
       JOIN users u ON u.id = s.user_id
       WHERE s.status = 'approved'`
    );

    const matchedIds = await searchSellers(query, approved.rows);
    const byId = new Map(approved.rows.map((s) => [s.id, s]));
    const sellers = matchedIds.map((id) => byId.get(id)).filter(Boolean);

    return res.status(200).json({ sellers });
  } catch (err) {
    return res.status(502).json({ message: 'Smart search is unavailable', error: err.message });
  }
});

module.exports = router;
