// One-off demo data seeder — safe to run multiple times (skips anything that already exists).
// Usage: node scripts/seed.js   (run from backend/, with DATABASE_URL pointing at the running Postgres)
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { pool } = require('../src/db');

const DEMO_PASSWORD = 'Demo@123';

const CONSUMERS = [
  { name: 'Demo Consumer', flat_no: 'A-204', phone: '9876543210', email: 'demo.consumer@communa.local' },
  { name: 'Faculty Guest', flat_no: 'Guest', phone: '9876500000', email: 'faculty.guest@communa.local' },
];

const SELLERS = [
  {
    name: 'Lakshmi\'s Kitchen', flat_no: 'B-102', phone: '9876543211', email: 'lakshmi.kitchen@communa.local',
    category: 'Food', title: 'Home-style Idli & Dosa Batter',
    description: 'Fresh ground batter every morning, no preservatives. Idli, dosa, and uttapam batter available in 1kg/2kg packs.',
    price_range: '₹80–150', contact_number: '9876543211',
  },
  {
    name: 'Fatima Ethnic Wear', flat_no: 'D-101', phone: '9876543212', email: 'fatima.ethnic@communa.local',
    category: 'Clothing', title: 'Sarees & Ethnic Wear',
    description: 'Curated collection of cotton and silk sarees, sourced directly from weavers. Custom blouse stitching also available.',
    price_range: '₹500–3000', contact_number: '9876543212',
  },
  {
    name: 'Suresh General Store', flat_no: 'A-101', phone: '9876543213', email: 'suresh.store@communa.local',
    category: 'Essentials', title: 'Daily Groceries & Essentials, Delivered',
    description: 'Rice, dal, oil, spices and daily household essentials — order in the evening, delivered to your door by morning.',
    price_range: 'Contact for pricing', contact_number: '9876543213',
  },
  {
    name: 'Vikram Tailoring', flat_no: 'C-108', phone: '9876543214', email: 'vikram.tailor@communa.local',
    category: 'Additional Services', title: 'Tailoring & Alterations',
    description: 'Blouse stitching, alterations, and custom tailoring for men and women. 20+ years of experience.',
    price_range: '₹100–800', contact_number: '9876543214',
  },
  {
    name: 'Ramesh Tuitions', flat_no: 'C-305', phone: '9876543215', email: 'ramesh.tuition@communa.local',
    category: 'Tuitions', title: 'Maths & Science Tuition (Class 6–10)',
    description: 'CBSE/State board Maths and Science tuition, small batches of 4-5 students. 10 years teaching experience.',
    price_range: '₹1500/month', contact_number: '9876543215',
  },
];

async function upsertUser({ name, flat_no, phone, email, role }) {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) return existing.rows[0].id;

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const result = await pool.query(
    `INSERT INTO users (name, flat_no, phone, email, password_hash, role, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'approved') RETURNING id`,
    [name, flat_no, phone, email, passwordHash, role]
  );
  return result.rows[0].id;
}

async function seed() {
  console.log('Seeding demo consumers...');
  for (const c of CONSUMERS) {
    await upsertUser({ ...c, role: 'consumer' });
    console.log(`  ✓ ${c.email}`);
  }

  console.log('Seeding demo sellers + approved listings...');
  for (const s of SELLERS) {
    const userId = await upsertUser({ name: s.name, flat_no: s.flat_no, phone: s.phone, email: s.email, role: 'seller' });

    const category = await pool.query('SELECT id FROM categories WHERE name = $1', [s.category]);
    if (category.rows.length === 0) {
      console.warn(`  ! Category "${s.category}" not found, skipping listing for ${s.email}`);
      continue;
    }
    const categoryId = category.rows[0].id;

    const existingListing = await pool.query(
      'SELECT id FROM sellers WHERE user_id = $1 AND title = $2',
      [userId, s.title]
    );
    if (existingListing.rows.length > 0) {
      console.log(`  = ${s.email} (listing already exists)`);
      continue;
    }

    await pool.query(
      `INSERT INTO sellers (user_id, category_id, title, description, price_range, contact_number, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'approved')`,
      [userId, categoryId, s.title, s.description, s.price_range, s.contact_number]
    );
    console.log(`  ✓ ${s.email} → "${s.title}" (${s.category})`);
  }

  console.log(`\nDone. All demo accounts use the password: ${DEMO_PASSWORD}`);
  await pool.end();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
