const express = require('express');
const { pool } = require('../db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

const SELLER_SELECT = `
  SELECT s.id, s.title, s.description, s.price_range, s.contact_number, s.status, s.created_at,
         c.name AS category, c.id AS category_id,
         u.id AS user_id, u.name AS seller_name, u.flat_no
  FROM sellers s
  JOIN categories c ON c.id = s.category_id
  JOIN users u ON u.id = s.user_id
`;

// GET /api/sellers?category=Food
router.get('/', verifyToken, async (req, res) => {
  const { category } = req.query;
  try {
    const params = [];
    let query = `${SELLER_SELECT} WHERE s.status = 'approved'`;
    if (category) {
      params.push(category);
      query += ` AND c.name = $${params.length}`;
    }
    query += ' ORDER BY s.created_at DESC';

    const result = await pool.query(query, params);
    return res.status(200).json({ sellers: result.rows });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch sellers', error: err.message });
  }
});

// GET /api/sellers/mine (the logged-in seller's own listings, any status)
router.get('/mine', verifyToken, requireRole('seller'), async (req, res) => {
  try {
    const result = await pool.query(
      `${SELLER_SELECT} WHERE s.user_id = $1 ORDER BY s.created_at DESC`,
      [req.user.id]
    );
    return res.status(200).json({ sellers: result.rows });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch your listings', error: err.message });
  }
});

// GET /api/sellers/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`${SELLER_SELECT} WHERE s.id = $1`, [req.params.id]);
    const seller = result.rows[0];
    if (!seller) return res.status(404).json({ message: 'Seller listing not found' });
    return res.status(200).json({ seller });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch listing', error: err.message });
  }
});

// POST /api/sellers
router.post('/', verifyToken, requireRole('seller'), async (req, res) => {
  const { category_id, title, description, price_range, contact_number } = req.body;
  if (!category_id || !title || !description || !contact_number) {
    return res.status(400).json({ message: 'category_id, title, description, contact_number are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO sellers (user_id, category_id, title, description, price_range, contact_number, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id, title, description, price_range, contact_number, status, created_at`,
      [req.user.id, category_id, title, description, price_range || null, contact_number]
    );
    return res.status(201).json({ seller: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create listing', error: err.message });
  }
});

// PUT /api/sellers/:id (owner only)
router.put('/:id', verifyToken, requireRole('seller'), async (req, res) => {
  const { title, description, price_range, contact_number, category_id } = req.body;
  try {
    const owned = await pool.query('SELECT user_id FROM sellers WHERE id = $1', [req.params.id]);
    if (owned.rows.length === 0) return res.status(404).json({ message: 'Listing not found' });
    if (owned.rows[0].user_id !== req.user.id) return res.status(403).json({ message: 'Not your listing' });

    const result = await pool.query(
      `UPDATE sellers
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           price_range = COALESCE($3, price_range),
           contact_number = COALESCE($4, contact_number),
           category_id = COALESCE($5, category_id)
       WHERE id = $6
       RETURNING id, title, description, price_range, contact_number, status, created_at`,
      [title, description, price_range, contact_number, category_id, req.params.id]
    );
    return res.status(200).json({ seller: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update listing', error: err.message });
  }
});

// DELETE /api/sellers/:id (owner only)
router.delete('/:id', verifyToken, requireRole('seller'), async (req, res) => {
  try {
    const owned = await pool.query('SELECT user_id FROM sellers WHERE id = $1', [req.params.id]);
    if (owned.rows.length === 0) return res.status(404).json({ message: 'Listing not found' });
    if (owned.rows[0].user_id !== req.user.id) return res.status(403).json({ message: 'Not your listing' });

    await pool.query('DELETE FROM sellers WHERE id = $1', [req.params.id]);
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete listing', error: err.message });
  }
});

module.exports = router;
