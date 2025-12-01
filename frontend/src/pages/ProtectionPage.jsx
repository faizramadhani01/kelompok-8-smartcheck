// frontend/src/pages/ProtectionPage.jsx
import React from 'react';

const steps = [
    {
        id: 1,
        title: 'Pilih paket proteksi',
        text: 'Saat membeli gadget, pilih paket proteksi yang sesuai durasi dan kebutuhanmu.'
    },
    {
        id: 2,
        title: 'Aktivasi dengan data resmi',
        text: 'Data IMEI dan nomor invoice dicatat dalam sistem SmartCheck untuk klaim yang mudah.'
    },
    {
        id: 3,
        title: 'Klaim cepat & transparan',
        text: 'Jika terjadi kerusakan, cukup datang ke store / hubungi Care. Proses klaim dipandu step-by-step.'
    }
];

const plans = [
    {
        id: 1,
        name: 'Screen Protection',
        desc: 'Proteksi kerusakan layar karena jatuh / retak dalam periode tertentu.',
        price: 'Mulai Rp 99.000',
        tag: 'Best untuk smartphone'
    },
    {
        id: 2,
        name: 'Full Device Protection',
        desc: 'Menanggung kerusakan fisik tertentu sesuai syarat & ketentuan.',
        price: 'Mulai Rp 199.000',
        tag: 'Paling lengkap'
    },
    {
        id: 3,
        name: 'Extended Warranty',
        desc: 'Perpanjangan masa garansi resmi hingga +1 atau +2 tahun.',
        price: 'Mulai Rp 149.000',
        tag: 'Khusus brand tertentu'
    }
];

function ProtectionPage() {
    return (
        <section className="info-section protection-page">
            <div className="info-inner">
                <div className="info-header">
                    <div>
                        <p className="info-kicker">PROTECTION</p>
                        <h2 className="info-title">SmartCheck Protection & Garansi Tambahan</h2>
                        <p className="info-lead">
                            Biar gadget tetap aman dipakai harian, SmartCheck menyediakan beberapa paket
                            proteksi yang bisa di-attach saat pembelian. Semua klaim tercatat rapi di sistem.
                        </p>
                    </div>
                    <div className="info-tags">
                        <span className="info-tag">Device Care</span>
                        <span className="info-tag">Extended Warranty</span>
                        <span className="info-tag">Screen Protection</span>
                    </div>
                </div>

                <div className="protection-steps">
                    {steps.map((s) => (
                        <div key={s.id} className="protection-step">
                            <div className="step-index">{s.id}</div>
                            <div className="step-body">
                                <h3>{s.title}</h3>
                                <p>{s.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="plan-grid">
                    {plans.map((p) => (
                        <article key={p.id} className="info-card">
                            <span className="info-chip">Plan</span>
                            <h3>{p.name}</h3>
                            <p>{p.desc}</p>
                            <div className="info-meta-row">
                                <span className="price">{p.price}</span>
                                <span className="info-pill">{p.tag}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProtectionPage;
