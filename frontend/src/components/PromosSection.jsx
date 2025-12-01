import React, { useState, useEffect } from 'react';
import { API_BASE } from '../api/config.js';

function PromosSection() {
  const [promos, setPromos] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    fetch(`${API_BASE}/api/promos`)
      .then((res) => res.json())
      .then(setPromos)
      .catch((err) => console.error('Error load promos:', err));
  }, []);

  // ambil kategori unik, buang yg kosong & yg "Semua" (case-insensitive)
  const dataCategories = [
    ...new Set(
      promos
        .map((p) => p.category?.trim())
        .filter(
          (c) => c && c.toLowerCase() !== 'semua'
        )
    ),
  ];

  // tambah tab "Semua" di depan
  const categories = ['Semua', ...dataCategories];

  const filteredPromos =
    activeCategory === 'Semua'
      ? promos
      : promos.filter((p) => p.category === activeCategory);

  return (
    <section id="promo" className="promo-section">
      <div className="promo-inner">
        {/* Header */}
        <div className="promo-header">
          <div>
            <h2 className="promo-title-main">Hot Promo Spesial</h2>
            <p className="promo-subtitle">
              Dapatkan penawaran terbaik untuk gadget, laptop, dan perangkat komputer favoritmu.
            </p>
          </div>
        </div>

        {/* Tabs Kategori */}
        <div className="promo-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`promo-tab ${cat === activeCategory ? 'promo-tab-active' : ''
                }`}
              onClick={() => setActiveCategory(cat)}
              type="button"
            >
              <span className="promo-tab-dot" />
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Promo */}
        <div className="promo-grid">
          {filteredPromos.map((item) => (
            <article key={item.id} className="promo-card">
              <div className="promo-image-wrap">
                <div className="promo-discount-pill">Hot Deal</div>
                <img src={item.image} alt={item.title} />
              </div>
              <div className="promo-content">
                <p className="promo-category">{item.category}</p>
                <h3 className="promo-title">{item.title}</h3>
                <p className="promo-desc">{item.description}</p>

                <div className="promo-bottom">
                  <div className="promo-price-wrap">
                    <span className="promo-price-label">Harga Promo</span>
                    <span className="promo-price">{item.price}</span>
                  </div>
                  <button type="button" className="promo-cta">
                    Lihat Detail
                  </button>
                </div>
              </div>
            </article>
          ))}

          {filteredPromos.length === 0 && (
            <div className="promo-empty">
              <p>Belum ada promo untuk kategori ini.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PromosSection;
