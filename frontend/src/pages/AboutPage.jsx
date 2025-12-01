// frontend/src/pages/AboutPage.jsx
import React from 'react';

const stats = [
    { id: 1, number: '48+', label: 'Cabang & titik penjualan (simulasi)' },
    { id: 2, number: '80.000+', label: 'Member terdaftar dalam ekosistem SmartCheck' },
    { id: 3, number: '5+', label: 'Brand flagship yang menjadi partner utama' },
    { id: 4, number: '4.8★', label: 'Rata-rata rating kepuasan pelanggan' }
];

const milestones = [
    {
        id: 1,
        year: '2019',
        title: 'SmartCheck berdiri',
        text: 'Mulai dari satu toko yang fokus pada smartphone & aksesoris.'
    },
    {
        id: 2,
        year: '2021',
        title: 'Perluasan ke laptop & IoT',
        text: 'Mulai menyediakan laptop, PC, dan perangkat smart home.'
    },
    {
        id: 3,
        year: '2023',
        title: 'Integrasi sistem proteksi & care',
        text: 'Sistem backend & web yang rapi untuk tracking promo, proteksi, dan service.'
    },
    {
        id: 4,
        year: '2024',
        title: 'SmartCheck Web Experience',
        text: 'Website interaktif yang kamu kembangkan sekarang sebagai etalase digital.'
    }
];

function AboutPage() {
    return (
        <section className="info-section about-page">
            <div className="info-inner">
                <div className="info-header">
                    <div>
                        <p className="info-kicker">ABOUT US</p>
                        <h2 className="info-title">Cerita di balik SmartCheck</h2>
                        <p className="info-lead">
                            SmartCheck dibangun sebagai tempat yang nyaman untuk mencari gadget,
                            konsultasi spek, hingga layanan after sales yang jelas.
                            Website ini jadi wajah digital yang nantinya bisa dikembangkan lagi
                            sebagai e-commerce penuh.
                        </p>
                    </div>
                    <div className="info-tags">
                        <span className="info-tag">Retail IT</span>
                        <span className="info-tag">Customer First</span>
                        <span className="info-tag">Tech Community</span>
                    </div>
                </div>

                <div className="about-stats">
                    {stats.map((s) => (
                        <div key={s.id} className="about-stat-card">
                            <h3>{s.number}</h3>
                            <p>{s.label}</p>
                        </div>
                    ))}
                </div>

                <h3 style={{ fontSize: '1rem', marginBottom: '0.6rem' }}>Timeline perjalanan singkat</h3>
                <div className="timeline">
                    {milestones.map((m) => (
                        <div key={m.id} className="timeline-item">
                            <span className="timeline-dot" />
                            <p className="timeline-year">{m.year}</p>
                            <p className="timeline-title">{m.title}</p>
                            <p className="timeline-text">{m.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default AboutPage;
