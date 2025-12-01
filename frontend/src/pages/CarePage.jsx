// frontend/src/pages/CarePage.jsx
import React from 'react';

const contactOptions = [
    {
        id: 1,
        title: 'Live Chat',
        desc: 'Tanyakan status pesanan, promo, atau rekomendasi gadget secara realtime.',
        label: 'Chat melalui WhatsApp / web'
    },
    {
        id: 2,
        title: 'Service & Perbaikan',
        desc: 'Booking slot service untuk pengecekan perangkat, penggantian spare part, dan lainnya.',
        label: 'Service point SmartCheck'
    },
    {
        id: 3,
        title: 'Ticket Support',
        desc: 'Setiap keluhan dicatat sebagai tiket, sehingga histori penanganan selalu rapi.',
        label: 'Terhubung dengan sistem'
    }
];

const serviceTips = [
    'Selalu simpan invoice & kartu garansi.',
    'Aktifkan proteksi saat pembelian jika memungkinkan.',
    'Backup data penting sebelum melakukan service.',
    'Gunakan suku cadang resmi untuk menjaga kualitas.'
];

function CarePage() {
    return (
        <section className="info-section care-page">
            <div className="info-inner">
                <div className="info-header">
                    <div>
                        <p className="info-kicker">CARE</p>
                        <h2 className="info-title">SmartCheck Care & Customer Support</h2>
                        <p className="info-lead">
                            Butuh bantuan seputar order, klaim proteksi, atau konsultasi spek?
                            Tim SmartCheck Care siap membantu lewat berbagai channel.
                        </p>
                    </div>
                    <div className="info-tags">
                        <span className="info-tag">After Sales</span>
                        <span className="info-tag">Service Request</span>
                        <span className="info-tag">Customer Happiness</span>
                    </div>
                </div>

                <div className="care-grid">
                    {contactOptions.map((c) => (
                        <article key={c.id} className="info-card">
                            <span className="info-chip">Channel</span>
                            <h3>{c.title}</h3>
                            <p>{c.desc}</p>
                            <div className="info-meta-row">
                                <span className="info-pill">{c.label}</span>
                            </div>
                        </article>
                    ))}
                </div>

                <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Tips sebelum mengajukan service</h3>
                    <div className="care-chip-row">
                        {serviceTips.map((tip) => (
                            <span key={tip} className="care-chip">
                                {tip}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CarePage;
