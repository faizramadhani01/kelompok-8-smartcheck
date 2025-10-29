import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/user - list all products
// Menyesuaikan dengan skema yang Anda kirim: kolom di tabel adalah id_produk, id_merk, id_kategori.
// Harga ada di tabel `id_seri` yang berelasi ke produk lewat id_produk.
router.get('/', async (req, res) => {
    try {
        // Aggregate series (id_seri) per product into a JSON array to avoid duplicate product rows
        try {
            const [rows] = await pool.query(
                `
            SELECT
                p.id_produk AS id,
                p.nama_produk,
                p.tahun_rilis,
                m.nama_merk,
                k.nama_kategori,
                IFNULL(JSON_ARRAYAGG(JSON_OBJECT('id_seri', s.id_seri, 'nama_seri', s.nama_seri, 'harga', s.harga)) , JSON_ARRAY()) AS series
            FROM produk p
            LEFT JOIN merk m ON p.id_merk = m.id_merk
            LEFT JOIN kategori k ON p.id_kategori = k.id_kategori
            LEFT JOIN id_seri s ON s.id_produk = p.id_produk
            GROUP BY p.id_produk
            ORDER BY p.id_produk
        `
            );

            // Parse JSON strings returned by MySQL (if any) into JS arrays/objects
            const parsed = rows.map(r => {
                try {
                    // Some MySQL setups already return JSON as JS objects; handle both cases
                    if (typeof r.series === 'string') r.series = JSON.parse(r.series);
                    if (!r.series) r.series = [];
                } catch (e) {
                    r.series = [];
                }
                return r;
            });

            return res.json(parsed);
        } catch (err) {
            // If id_seri table doesn't exist, fall back to returning products without series
            if (err && err.code === 'ER_NO_SUCH_TABLE' && /id_seri/i.test(err.sqlMessage || '')) {
                console.warn("id_seri table missing, returning products without series");
                const [rows] = await pool.query(`
                    SELECT
                        p.id_produk AS id,
                        p.nama_produk,
                        p.tahun_rilis,
                        m.nama_merk,
                        k.nama_kategori
                    FROM produk p
                    LEFT JOIN merk m ON p.id_merk = m.id_merk
                    LEFT JOIN kategori k ON p.id_kategori = k.id_kategori
                    ORDER BY p.id_produk
                `);

                const parsed = rows.map(r => ({ ...r, series: [] }));
                return res.json(parsed);
            }

            console.error("❌ Error executing query:", err);
            return res.status(500).json({
                message: "Gagal mengambil data produk dari database.",
                error: err.message,
                hint: "Pastikan tabel 'produk','merk','kategori','id_seri' sudah ada dan nama kolom sesuai skema."
            });
        }
    } catch (err) {
        console.error("❌ Error executing query:", err);
        res.status(500).json({
            message: "Gagal mengambil data produk dari database.",
            error: err.message,
            hint: "Pastikan tabel 'produk','merk','kategori','id_seri' sudah ada dan nama kolom sesuai skema."
        });
    }
});
// FUNGSI 2 (BARU): Mengambil SATU produk berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        try {
            const [rows] = await pool.query(
                `
      SELECT
        p.id_produk AS id,
        p.nama_produk,
        p.tahun_rilis,
        m.nama_merk,
        k.nama_kategori,
        IFNULL(JSON_ARRAYAGG(JSON_OBJECT('id_seri', s.id_seri, 'nama_seri', s.nama_seri, 'harga', s.harga)), JSON_ARRAY()) AS series
      FROM produk p
      LEFT JOIN merk m ON p.id_merk = m.id_merk
      LEFT JOIN kategori k ON p.id_kategori = k.id_kategori
      LEFT JOIN id_seri s ON s.id_produk = p.id_produk
      WHERE p.id_produk = ?
      GROUP BY p.id_produk
    `, [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Produk dengan ID tersebut tidak ditemukan.' });
            }

            const row = rows[0];
            try {
                if (typeof row.series === 'string') row.series = JSON.parse(row.series);
                if (!row.series) row.series = [];
            } catch (e) {
                row.series = [];
            }

            return res.json(row);
        } catch (err) {
            if (err && err.code === 'ER_NO_SUCH_TABLE' && /id_seri/i.test(err.sqlMessage || '')) {
                console.warn('id_seri table missing, returning product without series');
                const [rows] = await pool.query(
                    `SELECT p.id_produk AS id, p.nama_produk, p.tahun_rilis, m.nama_merk, k.nama_kategori FROM produk p LEFT JOIN merk m ON p.id_merk = m.id_merk LEFT JOIN kategori k ON p.id_kategori = k.id_kategori WHERE p.id_produk = ?`,
                    [id]
                );

                if (rows.length === 0) {
                    return res.status(404).json({ message: 'Produk dengan ID tersebut tidak ditemukan.' });
                }

                return res.json({ ...rows[0], series: [] });
            }

            console.error("❌ Error executing query:", err);
            return res.status(500).json({ message: "Gagal mengambil data produk.", error: err.message });
        }
    } catch (err) {
        console.error("❌ Error executing query:", err);
        res.status(500).json({ message: "Gagal mengambil data produk.", error: err.message });
    }
});

// FUNGSI 3 (BARU): Membuat produk BARU
router.post('/', async (req, res) => {
    try {
        const { nama_produk, tahun_rilis, id_merk, id_kategori } = req.body;

        // Validasi sederhana
        if (!nama_produk || !id_merk || !id_kategori) {
            return res.status(400).json({ message: 'Nama produk, id_merk, dan id_kategori wajib diisi.' });
        }

        const [result] = await pool.query(
            'INSERT INTO produk (id_merk, id_kategori, nama_produk, tahun_rilis) VALUES (?, ?, ?, ?)',
            [id_merk, id_kategori, nama_produk, tahun_rilis]
        );

        res.status(201).json({ message: 'Produk berhasil dibuat!', insertedId: result.insertId });
    } catch (err) {
        console.error("❌ Error executing query:", err);
        res.status(500).json({ message: "Gagal membuat produk baru.", error: err.message });
    }
});

// FUNGSI 4 (BARU): Memperbarui (UPDATE) produk
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_produk, tahun_rilis, id_merk, id_kategori } = req.body;

        const [result] = await pool.query(
            'UPDATE produk SET id_merk = ?, id_kategori = ?, nama_produk = ?, tahun_rilis = ? WHERE id_produk = ?',
            [id_merk, id_kategori, nama_produk, tahun_rilis, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk dengan ID tersebut tidak ditemukan.' });
        }

        res.json({ message: `Produk dengan ID ${id} berhasil diperbarui.` });
    } catch (err) {
        console.error("❌ Error executing query:", err);
        res.status(500).json({ message: "Gagal memperbarui produk.", error: err.message });
    }
});

// FUNGSI 5 (BARU): Menghapus produk
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM produk WHERE id_produk = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk dengan ID tersebut tidak ditemukan.' });
        }

        res.status(200).json({ message: `Produk dengan ID ${id} berhasil dihapus.` });
    } catch (err) {
        console.error("❌ Error executing query:", err);
        res.status(500).json({ message: "Gagal menghapus produk.", error: err.message });
    }
});
// Anda bisa menambahkan rute lain (GET by ID, POST, PUT, DELETE) di sini di masa depan

export default router;
