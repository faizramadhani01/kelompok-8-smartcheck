
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password harus diisi' });
  }

  try {
    // Cek apakah username sudah ada
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    // Enkripsi password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user baru
    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

    res.status(201).json({ message: 'Registrasi berhasil' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error saat registrasi' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password harus diisi' });
  }

  try {
    // Cek jumlah total user di database
    const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
    const userCount = totalUsers[0].count;

    // Jika tidak ada user sama sekali, izinkan login "sesuka hati"
    if (userCount === 0) {
      console.log('Login mode: No users in DB. Allowing any login.');
      return res.json({ message: 'Login berhasil (mode pengembangan)', token: 'dev-token' });
    }

    // Jika sudah ada user, lakukan validasi normal
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Username atau password salah' });
    }

    const user = users[0];

    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Username atau password salah' });
    }

    // Buat dan kirim token JWT
    const payload = { user: { id: user.id_user } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_default_secret', { expiresIn: '1h' });

    res.json({ message: 'Login berhasil', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error saat login' });
  }
});

export default router;
