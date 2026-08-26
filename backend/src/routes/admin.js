const express = require('express');
const { pool } = require('../db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken, requireRole('admin'));

async function logAction(adminId, targetType, targetId, action) {
  await pool.query(
    `INSERT INTO admin_actions (admin_id, target_type, target_id, action) VALUES ($1, $2, $3, $4)`,
    [adminId, targetType, targetId, action]
  );
}

// GET /api/admin/pending-users
router.get('/pending-users', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, flat_no, phone, email, role, status, created_at
       FROM users WHERE status = 'pending' ORDER BY created_at`
    );
    return res.status(200).json({ users: result.rows });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch pending users', error: err.message });
  }
});

// PATCH /api/admin/users/:id/approve
router.patch('/users/:id/approve', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE users SET status = 'approved' WHERE id = $1 RETURNING id, name, email, role, status`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    await logAction(req.user.id, 'user', req.params.id, 'approve');
    return res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to approve user', error: err.message });
  }
});

// PATCH /api/admin/users/:id/reject
router.patch('/users/:id/reject', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE users SET status = 'rejected' WHERE id = $1 RETURNING id, name, email, role, status`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    await logAction(req.user.id, 'user', req.params.id, 'reject');
    return res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to reject user', error: err.message });
  }
});

// GET /api/admin/sellers/pending
router.get('/sellers/pending', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.title, s.description, s.price_range, s.contact_number, s.status, s.created_at,
              c.name AS category, u.name AS seller_name, u.flat_no
       FROM sellers s
       JOIN categories c ON c.id = s.category_id
       JOIN users u ON u.id = s.user_id
       WHERE s.status = 'pending'
       ORDER BY s.created_at`
    );
    return res.status(200).json({ sellers: result.rows });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch pending sellers', error: err.message });
  }
});

// PATCH /api/admin/sellers/:id/approve
router.patch('/sellers/:id/approve', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE sellers SET status = 'approved' WHERE id = $1 RETURNING id, title, status`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Listing not found' });
    await logAction(req.user.id, 'seller', req.params.id, 'approve');
    return res.status(200).json({ seller: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to approve listing', error: err.message });
  }
});

// PATCH /api/admin/sellers/:id/reject
router.patch('/sellers/:id/reject', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE sellers SET status = 'rejected' WHERE id = $1 RETURNING id, title, status`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Listing not found' });
    await logAction(req.user.id, 'seller', req.params.id, 'reject');
    return res.status(200).json({ seller: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to reject listing', error: err.message });
  }
});

// GET /api/admin/sellers?category= (all approved sellers grouped by category, for admin view — doc §3.3)
router.get('/sellers', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.title, s.status, c.name AS category, u.name AS seller_name, u.flat_no
       FROM sellers s
       JOIN categories c ON c.id = s.category_id
       JOIN users u ON u.id = s.user_id
       WHERE s.status = 'approved'
       ORDER BY c.name, s.created_at DESC`
    );
    return res.status(200).json({ sellers: result.rows });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch sellers', error: err.message });
  }
});

module.exports = router;
