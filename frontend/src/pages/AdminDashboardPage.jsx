// frontend/src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE } from '../api/config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Helper function to create a new product
async function createProduct(payload, token) {
    const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Failed to create product');
    }
    return data;
}

function AdminDashboardPage() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        brand: '',
        specs: '',
        image: '',
        stock: '',
        category: ''
    });
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch categories on component mount
    useEffect(() => {
        fetch(`${API_BASE}/api/categories`)
            .then(res => res.json())
            .then(setCategories)
            .catch(err =>
                setStatus('Error: gagal mengambil kategori - ' + err.message)
            );
    }, []);

    // Fetch products for admin panel
    useEffect(() => {
        fetch(`${API_BASE}/api/products`)
            .then(res => res.json())
            .then(setProducts)
            .catch(err => setStatus('Error: gagal mengambil produk - ' + err.message));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('Menambahkan produk baru...');

        try {
            const payload = {
                ...form,
                price: parseFloat(form.price || 0),
                stock: parseInt(form.stock || 0, 10)
            };
            const newProduct = await createProduct(payload, token);
            setStatus(`Berhasil! Produk "${newProduct.name}" telah ditambahkan.`);
            setForm({
                name: '',
                description: '',
                price: '',
                brand: '',
                specs: '',
                image: '',
                stock: '',
                category: ''
            });
            // Redirect ke katalog agar daftar produk ter-refresh
            navigate('/catalog');
        } catch (err) {
            setStatus('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete product (admin only)
    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Gagal menghapus produk');
            setProducts(prev => prev.filter(p => p.id !== id));
            setStatus('Produk berhasil dihapus.');
        } catch (err) {
            setStatus('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const isError = status.startsWith('Error');

    return (
        <section
            className="admin-dashboard"
            style={{
                minHeight: '100vh',
                padding: '2.5rem 1.5rem',
                background: 'linear-gradient(135deg,#eef2ff,#f9fafb)'
            }}
        >
            <div
                style={{
                    maxWidth: 1100,
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1.1fr)',
                    gap: 24
                }}
            >
                {/* Kartu form tambah produk */}
                <div
                    style={{
                        background: '#ffffff',
                        borderRadius: 16,
                        padding: '1.75rem 1.5rem',
                        boxShadow: '0 18px 45px rgba(15,23,42,0.08)',
                        border: '1px solid #e5e7eb'
                    }}
                >
                    <header style={{ marginBottom: '1.5rem' }}>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: 22,
                                fontWeight: 600,
                                color: '#111827'
                            }}
                        >
                            Admin Dashboard
                        </h1>
                        <p
                            style={{
                                margin: '6px 0 0',
                                color: '#6b7280',
                                fontSize: 14
                            }}
                        >
                            Tambahkan produk baru ke katalog Smartcheck.
                        </p>
                    </header>

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: 'grid',
                            gap: '0.85rem'
                        }}
                    >
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: 13,
                                    color: '#374151',
                                    marginBottom: 4
                                }}
                            >
                                Nama Produk
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Contoh: iPhone 15 Pro 128GB"
                                style={{
                                    width: '100%',
                                    padding: '10px 11px',
                                    borderRadius: 10,
                                    border: '1px solid #e5e7eb',
                                    fontSize: 14
                                }}
                            />
                        </div>

                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: 13,
                                    color: '#374151',
                                    marginBottom: 4
                                }}
                            >
                                Deskripsi
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Tuliskan highlight produk, fitur utama, dll."
                                style={{
                                    width: '100%',
                                    padding: '10px 11px',
                                    borderRadius: 10,
                                    border: '1px solid #e5e7eb',
                                    resize: 'vertical',
                                    fontSize: 14
                                }}
                            />
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 12
                            }}
                        >
                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: 13,
                                        color: '#374151',
                                        marginBottom: 4
                                    }}
                                >
                                    Harga (Rp)
                                </label>
                                <input
                                    name="price"
                                    type="number"
                                    value={form.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="1000"
                                    placeholder="contoh: 4500000"
                                    style={{
                                        width: '100%',
                                        padding: '10px 11px',
                                        borderRadius: 10,
                                        border: '1px solid #e5e7eb',
                                        fontSize: 14
                                    }}
                                />
                            </div>

                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: 13,
                                        color: '#374151',
                                        marginBottom: 4
                                    }}
                                >
                                    Stok
                                </label>
                                <input
                                    name="stock"
                                    type="number"
                                    value={form.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    placeholder="contoh: 20"
                                    style={{
                                        width: '100%',
                                        padding: '10px 11px',
                                        borderRadius: 10,
                                        border: '1px solid #e5e7eb',
                                        fontSize: 14
                                    }}
                                />
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 12
                            }}
                        >
                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: 13,
                                        color: '#374151',
                                        marginBottom: 4
                                    }}
                                >
                                    Brand
                                </label>
                                <input
                                    name="brand"
                                    value={form.brand}
                                    onChange={handleChange}
                                    placeholder="Contoh: Apple, Samsung"
                                    style={{
                                        width: '100%',
                                        padding: '10px 11px',
                                        borderRadius: 10,
                                        border: '1px solid #e5e7eb',
                                        fontSize: 14
                                    }}
                                />
                            </div>

                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: 13,
                                        color: '#374151',
                                        marginBottom: 4
                                    }}
                                >
                                    Kategori
                                </label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 11px',
                                        borderRadius: 10,
                                        border: '1px solid #e5e7eb',
                                        fontSize: 14,
                                        backgroundColor: '#fff'
                                    }}
                                >
                                    <option value="">Pilih kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: 13,
                                    color: '#374151',
                                    marginBottom: 4
                                }}
                            >
                                URL Gambar
                            </label>
                            <input
                                name="image"
                                value={form.image}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                style={{
                                    width: '100%',
                                    padding: '10px 11px',
                                    borderRadius: 10,
                                    border: '1px solid #e5e7eb',
                                    fontSize: 14
                                }}
                            />
                            <p
                                style={{
                                    margin: '4px 0 0',
                                    fontSize: 11,
                                    color: '#9ca3af'
                                }}
                            >
                                Gunakan URL gambar yang bisa diakses publik.
                            </p>
                        </div>

                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: 13,
                                    color: '#374151',
                                    marginBottom: 4
                                }}
                            >
                                Spesifikasi (opsional, format JSON)
                            </label>
                            <textarea
                                name="specs"
                                value={form.specs}
                                onChange={handleChange}
                                rows={2}
                                placeholder={`Contoh:\n{"warna": "hitam", "garansi": "1 tahun"}`}
                                style={{
                                    width: '100%',
                                    padding: '10px 11px',
                                    borderRadius: 10,
                                    border: '1px solid #e5e7eb',
                                    resize: 'vertical',
                                    fontSize: 13,
                                    fontFamily: 'monospace'
                                }}
                            />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginTop: '0.5rem'
                            }}
                        >
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '10px 18px',
                                    borderRadius: 999,
                                    border: 'none',
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    background: loading
                                        ? '#9ca3af'
                                        : 'linear-gradient(135deg,#4f46e5,#22c55e)',
                                    color: '#ffffff',
                                    boxShadow:
                                        '0 10px 22px rgba(37,99,235,0.25)',
                                    transition: 'transform 0.1s, box-shadow 0.1s'
                                }}
                                onMouseDown={(e) => {
                                    e.currentTarget.style.transform = 'translateY(1px)';
                                    e.currentTarget.style.boxShadow =
                                        '0 4px 12px rgba(37,99,235,0.20)';
                                }}
                                onMouseUp={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow =
                                        '0 10px 22px rgba(37,99,235,0.25)';
                                }}
                            >
                                {loading ? 'Menyimpan...' : 'Tambah Produk'}
                            </button>
                        </div>

                        {status && (
                            <div
                                style={{
                                    marginTop: 10,
                                    padding: '10px 12px',
                                    borderRadius: 10,
                                    border: `1px solid ${isError ? '#fecaca' : '#bbf7d0'
                                        }`,
                                    backgroundColor: isError
                                        ? '#fef2f2'
                                        : '#ecfdf5',
                                    color: isError ? '#b91c1c' : '#166534',
                                    fontSize: 13
                                }}
                            >
                                {status}
                            </div>
                        )}
                    </form>

                    {/* Daftar produk admin: tampilkan ringkasan + tombol hapus */}
                    {(user?.role_id === 1 || user?.role === 1) && (
                        <div style={{ marginTop: 18 }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: 15 }}>Daftar Produk (Admin)</h3>
                            <div style={{ display: 'grid', gap: 10 }}>
                                {products.length === 0 && (
                                    <div style={{ color: '#6b7280', fontSize: 13 }}>Belum ada produk.</div>
                                )}
                                {products.map((p) => (
                                    <div
                                        key={p.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                            padding: '8px 10px',
                                            borderRadius: 8,
                                            border: '1px solid #e5e7eb',
                                            background: '#fff'
                                        }}
                                    >
                                        <div style={{ width: 64, height: 48, overflow: 'hidden', borderRadius: 6 }}>
                                            <img src={p.image || '/'} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                                            <div style={{ fontSize: 12, color: '#6b7280' }}>{p.category} • {p.brand} • Rp {p.price}</div>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                style={{
                                                    background: '#ef4444',
                                                    color: '#fff',
                                                    border: 'none',
                                                    padding: '6px 10px',
                                                    borderRadius: 8,
                                                    cursor: 'pointer'
                                                }}
                                                type="button"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Panel info samping */}
                <aside
                    style={{
                        alignSelf: 'stretch',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16
                    }}
                >
                    <div
                        style={{
                            background: '#0f172a',
                            color: '#e5e7eb',
                            borderRadius: 16,
                            padding: '1.25rem 1.2rem',
                            boxShadow: '0 16px 35px rgba(15,23,42,0.65)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                opacity: 0.18,
                                background:
                                    'radial-gradient(circle at 0 0,#22c55e,transparent 55%), radial-gradient(circle at 100% 100%,#3b82f6,transparent 55%)'
                            }}
                        />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <p
                                style={{
                                    fontSize: 12,
                                    margin: 0,
                                    color: '#9ca3af'
                                }}
                            >
                                Selamat datang,
                            </p>
                            <h2
                                style={{
                                    margin: '4px 0 10px',
                                    fontSize: 18,
                                    fontWeight: 600
                                }}
                            >
                                {user?.name || 'Admin'}
                            </h2>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 13,
                                    color: '#d1d5db'
                                }}
                            >
                                Dari panel ini kamu bisa menambah produk baru,
                                mengatur stok, dan memperkaya katalog Smartcheck.
                            </p>
                        </div>
                    </div>

                    <div
                        style={{
                            background: '#ffffff',
                            borderRadius: 16,
                            padding: '1.25rem 1.2rem',
                            boxShadow: '0 10px 25px rgba(15,23,42,0.06)',
                            border: '1px solid #e5e7eb'
                        }}
                    >
                        <h3
                            style={{
                                marginTop: 0,
                                marginBottom: 8,
                                fontSize: 15,
                                fontWeight: 600,
                                color: '#111827'
                            }}
                        >
                            Tips Pengisian Produk
                        </h3>
                        <ul
                            style={{
                                margin: 0,
                                paddingLeft: 18,
                                fontSize: 13,
                                color: '#4b5563'
                            }}
                        >
                            <li>Gunakan nama produk yang jelas dan mudah dicari.</li>
                            <li>
                                Pastikan harga dan stok sesuai dengan kondisi
                                gudang.
                            </li>
                            <li>
                                Tambahkan deskripsi singkat yang menjual dan
                                informatif.
                            </li>
                            <li>
                                Jika memakai spesifikasi JSON, pastikan formatnya
                                valid.
                            </li>
                        </ul>
                    </div>

                    <div
                        style={{
                            background: '#ecfdf5',
                            borderRadius: 14,
                            padding: '0.9rem 0.9rem',
                            border: '1px dashed #6ee7b7',
                            fontSize: 12,
                            color: '#047857'
                        }}
                    >
                        Hint: setelah produk ditambahkan, cek tampilan di halaman
                        katalog untuk memastikan data sudah tampil dengan benar.
                    </div>
                </aside>
            </div>
        </section>
    );
}

export default AdminDashboardPage;
