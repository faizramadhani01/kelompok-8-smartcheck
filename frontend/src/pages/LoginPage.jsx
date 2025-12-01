// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ username: '', password: '' });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Auto-login handler for admin credentials
    const handleAdminAutoLogin = async () => {
        setLoading(true);
        setStatus('Auto-login sebagai admin...');

        try {
            const adminCreds = { username: 'admin', password: 'admin' };
            const data = await loginUser(adminCreds);
            login(data.user, data.token);
            setStatus('Admin login berhasil! Mengarahkan ke dashboard...');
            
            const isAdmin = Number(data.user?.role_id) === 1;
            setTimeout(() => {
                navigate(isAdmin ? '/admin/dashboard' : '/');
            }, 600);
        } catch (err) {
            setStatus('Error auto-login: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange_old = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('Sedang login...');

        try {
            const data = await loginUser(form);
            login(data.user, data.token);
            setStatus('Login berhasil! Mengarahkan...');
            
            // Redirect based on role: role_id === 1 is admin
            const isAdmin = Number(data.user?.role_id) === 1;
            setTimeout(() => {
                navigate(isAdmin ? '/admin/dashboard' : '/');
            }, 800);

        } catch (err) {
            setStatus('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-section">
            <div className="auth-inner">
                <div className="auth-card">
                    <div className="auth-header">
                        <span className="logo-box">SC</span>
                        <div>
                            <h1>Masuk ke SmartCheck</h1>
                            <p>Gunakan username yang sudah terdaftar untuk mengakses promo & riwayat.</p>
                        </div>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <label>
                            Username
                            <input
                                type="text"
                                name="username"
                                placeholder="Username Anda"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Password
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <button type="submit" className="auth-submit" disabled={loading}>
                            {loading ? 'Memproses...' : 'Masuk'}
                        </button>

                        {status && <p className="auth-status">{status}</p>}
                    </form>

                    <p className="auth-switch">
                        Belum punya akun?{' '}
                        <Link to="/register">
                            <span>Buat akun baru</span>
                        </Link>
                    </p>
                </div>

                <div className="auth-side">
                    <h2>SmartCheck Member Area</h2>
                    <p>
                        Dengan membuat akun, kamu bisa menyimpan wishlist, melihat histori pembelian,
                        dan mendapatkan info promo spesial lebih cepat.
                    </p>
                    <ul>
                        <li>Notifikasi promo khusus member</li>
                        <li>Riwayat transaksi dan proteksi perangkat</li>
                        <li>Prioritas saat event & pre-order</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default LoginPage;
