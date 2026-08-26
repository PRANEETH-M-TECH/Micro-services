const express = require('express');
const { verifyToken, requireRole } = require('../middleware/auth');
const { suggestCategory, generateListing } = require('../services/gemini');

const router = express.Router();
router.use(verifyToken, requireRole('seller'));

// POST /api/ai/suggest-category  { description: "..." }
router.post('/suggest-category', async (req, res) => {
  const { description } = req.body;
  if (!description || !description.trim()) {
    return res.status(400).json({ message: 'description is required' });
  }
  try {
    const category = await suggestCategory(description);
    return res.status(200).json({ category });
  } catch (err) {
    return res.status(502).json({ message: 'AI category suggestion is unavailable', error: err.message });
  }
});

// POST /api/ai/generate-listing  { text: "..." }
router.post('/generate-listing', async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'text is required' });
  }
  try {
    const listing = await generateListing(text);
    return res.status(200).json({ listing });
  } catch (err) {
    return res.status(502).json({ message: 'AI listing generation is unavailable', error: err.message });
  }
});

module.exports = router;
