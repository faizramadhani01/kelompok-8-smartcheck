import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { API_BASE } from '../api/config.js';

function ProfilPage() {
    const { user, logout, login } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    if (!user) return <Navigate to="/login" replace />;

    const initials = (user.name || '')
        .split(' ')
        .map((s) => s[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem('smartcheck_token');
        setLoading(true);
        setStatus('Menyimpan...');

        try {
            const res = await fetch(`${API_BASE}/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ name: form.name, email: form.email })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || 'Gagal menyimpan profil');
            }

            const updated = await res.json();
            login({ ...user, name: updated.name, email: updated.email }, token);
            window.dispatchEvent(new Event('auth:changed'));
            setStatus('Profil berhasil disimpan!');
            setTimeout(() => setIsEditing(false), 600);
        } catch (err) {
            setStatus('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-section" style={{ padding: '2rem 1rem' }}>
            <div className="auth-inner" style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
                <div className="auth-card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ width: 72, height: 72, borderRadius: 14, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#3730a3' }}>{initials}</div>
                        <div>
                            <h2 style={{ margin: 0 }}>Profil Akun</h2>
                            <p style={{ margin: 0, color: '#6b7280' }}>Kelola informasi dasar akun dan kontakmu.</p>
                        </div>
                    </div>

                    <div style={{ marginTop: 8 }}>
                        {!isEditing ? (
                            <>
                                <div style={{ display: 'grid', gap: 12 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>Nama Lengkap</label>
                                        <div style={{ padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #e6eef8', color: '#111827' }}>{user.name}</div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>Email</label>
                                        <div style={{ padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #e6eef8', color: '#111827' }}>{user.email}</div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>Role</label>
                                        <div style={{ padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #e6eef8', color: '#111827' }}>{user.role || user.role_id || 'Member'}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                                    <button type="button" className="auth-submit" onClick={() => setIsEditing(true)} style={{ padding: '10px 14px' }}>Edit Profil</button>
                                    <button type="button" className="auth-submit" onClick={handleLogout} style={{ background: '#ef4444', borderColor: '#ef4444', padding: '10px 14px' }}>Logout</button>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: 'grid', gap: 12 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>Nama Lengkap</label>
                                    <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e6eef8' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>Email</label>
                                    <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e6eef8' }} />
                                </div>

                                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                                    <button type="submit" className="auth-submit" disabled={loading} style={{ padding: '10px 14px' }}>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                                    <button type="button" className="auth-submit" onClick={() => { setIsEditing(false); setForm({ name: user.name, email: user.email }); setStatus(''); }} style={{ background: '#9ca3af', borderColor: '#9ca3af', padding: '10px 14px' }}>Batal</button>
                                </div>

                                {status && (
                                    <div style={{ marginTop: 8, color: status.startsWith('Error') ? '#b91c1c' : '#065f46', background: status.startsWith('Error') ? '#fee2e2' : '#ecfdf5', padding: 10, borderRadius: 8, border: '1px solid rgba(0,0,0,0.03)' }}>{status}</div>
                                )}
                            </form>
                        )}
                    </div>
                </div>

                <aside className="auth-side" style={{ padding: 20, background: '#ffffff', borderRadius: 10, border: '1px solid #eef2ff' }}>
                    <h3 style={{ marginTop: 0 }}>Keamanan & Bantuan</h3>
                    <p style={{ color: '#6b7280' }}>Pastikan password Anda aman. Untuk mengubah kata sandi, hubungi admin atau gunakan fitur reset password bila tersedia.</p>
                    <ul style={{ paddingLeft: 18, color: '#374151' }}>
                        <li>Data akun terenkripsi dan disimpan di server</li>
                        <li>Gunakan password yang berbeda untuk setiap layanan</li>
                        <li>Hubungi support@smartcheck.example jika butuh bantuan</li>
                    </ul>

                    <div style={{ marginTop: 14 }}>
                        <button onClick={() => navigate('/catalog')} className="auth-submit" style={{ padding: '10px 12px' }}>Kembali Belanja</button>
                    </div>
                </aside>
            </div>
        </section>
    );
}

export default ProfilPage;
