// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setStatus('Error: password dan konfirmasi tidak sama');
            return;
        }

        setLoading(true);
        setStatus('Mendaftarkan akun...');

        try {
            const payload = {
                name: form.name,
                email: form.email,
                password: form.password
            };
            const data = await registerUser(payload);
            // Auto-login after register
            login(data.user, data.token);
            setStatus('Pendaftaran berhasil! Mengarahkan...');
            const isAdmin = Number(data.user?.role_id || data.user?.role) === 1;
            setTimeout(() => navigate(isAdmin ? '/admin/dashboard' : '/'), 800);
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
                            <h1>Buat Akun SmartCheck</h1>
                            <p>Daftar dengan email aktif untuk menikmati fitur member.</p>
                        </div>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <label>
                            username
                            <input
                                type="text"
                                name="name"
                                placeholder="Nama"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Email
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Password
                            <input
                                type="password"
                                name="password"
                                placeholder="Minimal 6 karakter"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Konfirmasi password
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Ulangi password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <button type="submit" className="auth-submit" disabled={loading}>
                            {loading ? 'Memproses...' : 'Daftar'}
                        </button>

                        {status && <p className="auth-status">{status}</p>}
                    </form>

                    <p className="auth-switch">
                        Sudah punya akun?{' '}
                        <Link to="/login">
                            <span>Masuk sekarang</span>
                        </Link>
                    </p>
                </div>

                <div className="auth-side">
                    <h2>Keuntungan punya akun</h2>
                    <p>
                        Data akun bisa dikembangkan untuk integrasi ke sistem backend,
                        seperti riwayat pemesanan, status proteksi, dan notifikasi personal.
                    </p>
                    <ul>
                        <li>Satu akun untuk semua cabang SmartCheck</li>
                        <li>Mudah cek status order dan proteksi</li>
                        <li>Voucher dan kupon digital ke depannya</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default RegisterPage;
