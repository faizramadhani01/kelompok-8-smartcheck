
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/meta/merks - list all brands for dropdowns
router.get('/merks', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id_merk, nama_merk FROM merk ORDER BY nama_merk');
        res.json(rows);
    } catch (err) {
        console.error("❌ Error fetching merks:", err);
        res.status(500).json({ message: "Gagal mengambil data merk." });
    }
});

// GET /api/meta/kategoris - list all categories for dropdowns
router.get('/kategoris', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id_kategori, nama_kategori FROM kategori ORDER BY nama_kategori');
        res.json(rows);
    } catch (err) {
        console.error("❌ Error fetching kategoris:", err);
        res.status(500).json({ message: "Gagal mengambil data kategori." });
    }
});

export default router;
