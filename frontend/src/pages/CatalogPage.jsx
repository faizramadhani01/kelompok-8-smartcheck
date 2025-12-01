import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/config.js';

function CatalogPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/products`)
      .then((res) => res.json())
      .then(setAllProducts)
      .catch((err) => console.error('Error load products:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    'All',
    'Gadget',
    'Laptop',
    'Computer',
    'Electronics',
    'Accessories',

  ];

  const filteredProducts = allProducts.filter((p) => {
    const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const lowerQ = query.toLowerCase();
    const matchSearch =
      !lowerQ ||
      p.name.toLowerCase().includes(lowerQ) ||
      (p.brand && p.brand.toLowerCase().includes(lowerQ));
    return matchCategory && matchSearch;
  });

  return (
    <section className="catalog-section" id="catalog">
      <div className="catalog-inner">
        <div className="catalog-header">
          <div>
            <h2 className="section-title">Katalog Produk</h2>
            <p className="catalog-subtitle">
              Pilih gadget, laptop, dan elektronik favoritmu di SmartCheck.
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="catalog-category-tabs">
          {categories.map((c) => (
            <button
              key={c}
              className={`catalog-tab ${c === categoryFilter ? 'catalog-tab-active' : ''}`}
              onClick={() => setCategoryFilter(c)}
              type="button"
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="catalog-search">
          <input
            type="text"
            placeholder="🔍 Cari produk, brand, atau kategori..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Sedang memuat produk…</p>
        ) : (
          <div className="catalog-grid">
            {filteredProducts.map((p) => (
              <article
                key={p.id}
                className="catalog-card"
                onClick={() => navigate(`/catalog/${p.id}`)}
              >
                <div className="catalog-image-wrap">
                  <img src={p.image} alt={p.name} />
                </div>
                <div className="catalog-card-body">
                  <p className="catalog-category">{p.category}</p>
                  <h3 className="catalog-name">{p.name}</h3>
                  <p className="catalog-brand">{p.brand}</p>
                  <p className="catalog-price">{p.price}</p>
                </div>
              </article>
            ))}
            {!loading && filteredProducts.length === 0 && (
              <p>Tidak ditemukan produk yang cocok.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default CatalogPage;
