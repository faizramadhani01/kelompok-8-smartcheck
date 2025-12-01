// frontend/src/pages/PromoPage.jsx
import React from 'react';

const highlightPromos = [
    {
        id: 1,
        type: 'Smartphone',
        title: 'Weekend Gadget Deals',
        desc: 'Diskon hingga 1,5 juta untuk seri flagship pilihan + bonus tempered glass & case.',
        price: 'Potongan s/d Rp 1.500.000',
        tag: 'Online & Offline',
        highlight: true
    },
    {
        id: 2,
        type: 'Laptop',
        title: 'Productivity Bundle',
        desc: 'Laptop ultrabook + mouse wireless + backpack dengan cicilan 0% 12x.',
        price: 'Mulai Rp 799.000/bulan',
        tag: '0% Installment'
    },
    {
        id: 3,
        type: 'Accessories',
        title: 'Accessories Crazy Sale',
        desc: 'Charger, kabel data, dan TWS mulai dari harga serba 99 ribu.',
        price: 'Start from Rp 99.000',
        tag: 'Limited Stock'
    },
    {
        id: 4,
        type: 'Trade-in',
        title: 'Upgrade & Trade-in',
        desc: 'Tukar tambah resmi dengan appraisal transparan. Tambahan voucher hingga 500 ribu.',
        price: 'Extra voucher Rp 500.000',
        tag: 'Trade-in Program'
    }
];

const benefitBadges = [
    '0% cicilan hingga 24x',
    'Gratis ongkir area tertentu',
    'Trade-in resmi & transparan',
    'Bonus aksesori original',
    'Promo bisa diatur via Admin page'
];

function PromoPage() {
    return (
        <section className="info-section promo-page">
            <div className="info-inner">
                <div className="info-header">
                    <div>
                        <p className="info-kicker">PROMO</p>
                        <h2 className="info-title">Hot Deals & Bundling SmartCheck</h2>
                        <p className="info-lead">
                            Temukan promo terbaik untuk upgrade gadget, laptop, dan aksesori.
                            Admin bisa menambahkan promo utama di dashboard, sementara halaman ini
                            menjadi etalase highlight yang selalu menarik dilihat customer.
                        </p>
                    </div>
                    <div className="info-tags">
                        <span className="info-tag">Flash Sale</span>
                        <span className="info-tag">Member Only</span>
                        <span className="info-tag">Bundle Hemat</span>
                    </div>
                </div>

                <div className="info-grid promo-page-grid">
                    {highlightPromos.map((promo) => (
                        <article key={promo.id} className="info-card">
                            <span className="info-chip">{promo.type}</span>
                            <h3>{promo.title}</h3>
                            <p>{promo.desc}</p>
                            <div className="info-meta-row">
                                <span className="price">{promo.price}</span>
                                <span className="info-pill">{promo.tag}</span>
                            </div>
                            {promo.highlight && (
                                <span className="info-card-badge">Best Pick</span>
                            )}
                        </article>
                    ))}
                </div>

                <div className="info-badges-row">
                    {benefitBadges.map((b) => (
                        <span key={b} className="info-badge-item">
                            {b}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PromoPage;
