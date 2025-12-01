require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// visitor counter sederhana (in-memory)
let visitorCount = 104633;

// =============== MIDDLEWARE ===============
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Middleware untuk otentikasi user
function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // payload contains { userId, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Middleware untuk memeriksa peran admin
function isAdmin(req, res, next) {
  // Asumsi role_id 1 adalah Admin
  if (Number(req.user?.role) !== 1) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
}


// =============== HEALTHCHECK ===============
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', message: 'SmartCheck backend is healthy ✅' });
  } catch (err) {
    console.error('Healthcheck error:', err);
    res.status(500).json({ status: 'error', message: 'DB connection failed' });
  }
});

// =============== CATEGORIES ===============
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, slug FROM product_categories ORDER BY name'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// =============== PROMOS ===============
app.get('/api/promos', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id, p.title, p.description, p.price, p.image, p.is_active,
        pc.name AS category
      FROM promos p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      ORDER BY p.id DESC
      `
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching promos:', err);
    res.status(500).json({ error: 'Failed to fetch promos' });
  }
});

app.post('/api/promos', authenticate, isAdmin, async (req, res) => {
  const { title, description, price, category, image } = req.body;
  if (!title || !price || !category) {
    return res.status(400).json({ error: 'title, price, dan category wajib diisi' });
  }
  try {
    const [catRows] = await pool.query('SELECT id FROM product_categories WHERE name = ?', [category]);
    const categoryId = catRows[0]?.id || null;
    const [result] = await pool.query(
      `INSERT INTO promos (title, description, price, category_id, image, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
      [title, description || '', price, categoryId, image || '']
    );
    res.status(201).json({ id: result.insertId, title, price, category });
  } catch (err) {
    console.error('Error inserting promo:', err);
    res.status(500).json({ error: 'Failed to create promo' });
  }
});

// =============== PRODUCTS / CATALOG ===============
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        pr.id, pr.name, pr.description, pr.price, pr.brand, pr.specs, pr.image, pr.stock, pr.status,
        pc.name AS category
      FROM products pr
      LEFT JOIN product_categories pc ON pr.category_id = pc.id
      ORDER BY pr.id DESC
      `
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        pr.id, pr.name, pr.description, pr.price, pr.brand, pr.specs, pr.image, pr.stock, pr.status,
        pc.name AS category
      FROM products pr
      LEFT JOIN product_categories pc ON pr.category_id = pc.id
      WHERE pr.id = ? 
      `,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// [ADMIN] Endpoint untuk membuat produk baru
app.post('/api/products', authenticate, isAdmin, async (req, res) => {
  const { name, description, price, brand, specs, image, stock, category } = req.body;

  if (!name || !price || !category || !stock) {
    return res.status(400).json({ error: 'name, price, category, dan stock wajib diisi' });
  }

  try {
    const [catRows] = await pool.query('SELECT id FROM product_categories WHERE name = ?', [category]);
    const categoryId = catRows[0]?.id;

    if (!categoryId) {
      return res.status(400).json({ error: `Kategori '${category}' tidak ditemukan` });
    }

    const [result] = await pool.query(
      `INSERT INTO products (name, description, price, brand, specs, image, stock, status, category_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?)`,
      [name, description || '', Number(price), brand || '', specs || '', image || '', Number(stock), categoryId]
    );

    const newProduct = {
      id: result.insertId, name, description, price, brand, specs, image, stock, category
    };
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});


// =============== VISITOR COUNTER ===============
app.get('/api/visitor-count', (req, res) => {
  visitorCount += 1;
  res.json({ count: visitorCount });
});

// =============== ORDERS ===============
app.post('/api/orders', authenticate, async (req, res) => {
  const userId = req.user?.userId;
  const { product_id, qty = 1, customer_name, customer_phone, customer_email, shipping_address, note } = req.body || {};

  if (!product_id || !customer_name || !customer_phone || !shipping_address) {
    return res.status(400).json({ error: 'Data wajib tidak lengkap' });
  }

  try {
    const [prodRows] = await pool.query('SELECT id, price FROM products WHERE id = ?', [product_id]);
    if (prodRows.length === 0) return res.status(404).json({ error: 'Product not found' });

    const price = Number(prodRows[0].price || 0);
    const total_price = price * Number(qty || 1);

    const [result] = await pool.query(
      `INSERT INTO orders (user_id, product_id, qty, customer_name, customer_phone, customer_email, shipping_address, note, total_price, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [userId || null, product_id, qty, customer_name, customer_phone, customer_email || '', shipping_address, note || '', total_price]
    );

    res.status(201).json({ id: result.insertId, product_id, qty, total_price, status: 'pending' });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// =============== AUTH (REGISTER / LOGIN) ===============
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required' });
  }
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (role_id, name, email, password_hash) VALUES (?, ?, ?, ?)',
      [3, name, email, passwordHash] // Default role_id = 3 (Customer)
    );
    const userId = result.insertId;
    const token = jwt.sign({ userId, role: 3 }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: { id: userId, name, email, role_id: 3 }, token });
  } catch (err) {
    console.error('Error in /api/auth/register:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  try {
    const [rows] = await pool.query('SELECT id, name, email, password_hash, role_id FROM users WHERE name = ?', [username]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, role: user.role_id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role_id: user.role_id }, token });
  } catch (err) {
    console.error('Error in /api/auth/login:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// =============== USER PROFILE ===============
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const [rows] = await pool.query('SELECT id, name, email, role_id FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const u = rows[0];
    res.json({ id: u.id, name: u.name, email: u.email, role: u.role_id });
  } catch (err) {
    console.error('Error in /api/auth/me:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.put('/api/users/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id);
  const requester = req.user;
  if (requester.userId !== id && Number(requester.role) !== 1) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { name, email } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'name and email are required' });
  try {
    await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
    const [rows] = await pool.query('SELECT id, name, email, role_id FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found after update' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ==============================================
app.listen(PORT, () => {
  console.log(`SmartCheck backend running on http://localhost:${PORT}`);
});
