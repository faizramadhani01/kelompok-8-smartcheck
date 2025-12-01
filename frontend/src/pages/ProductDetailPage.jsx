// frontend/src/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/config';
import { createOrder } from '../api/orders';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    shipping_address: '',
    note: ''
  });
  const [orderStatus, setOrderStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('smartcheck_token');
  const isLoggedIn = !!token;

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`${API_BASE}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Error loading product', err);
      } finally {
        setLoadingProduct(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setOrderStatus('Silakan login terlebih dahulu sebelum melakukan pemesanan.');
      return;
    }
    if (!product) return;

    setSubmitting(true);
    setOrderStatus('Membuat pesanan...');
    try {
      const token = localStorage.getItem('smartcheck_token');
      const payload = {
        product_id: product.id,
        qty,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        customer_email: form.customer_email,
        shipping_address: form.shipping_address,
        note: form.note
      };

      const res = await createOrder(payload, token);
      setOrderStatus('Pesanan berhasil dibuat. ID Pesanan: ' + res.id);
      // optionally navigate to orders page
      setSubmitting(false);
    } catch (err) {
      console.error('Order error', err);
      setOrderStatus('Gagal membuat pesanan: ' + err.message);
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <section className="info-section">
        <div className="info-inner">
          <p>Memuat detail produk...</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="info-section">
        <div className="info-inner">
          <p>Produk tidak ditemukan.</p>
        </div>
      </section>
    );
  }

  const estimatedTotal = Number(product.price || 0) * Number(qty || 1);

  return (
    <section className="info-section">
      <div className="info-inner product-detail-layout">
        <div className="product-detail-main">
          <p className="info-kicker">DETAIL PRODUK</p>
          <h2 className="info-title">{product.name}</h2>
          <p className="info-lead">{product.description}</p>

          <div className="product-detail-meta">
            <div>
              <span className="price">
                Rp {Number(product.price).toLocaleString('id-ID')}
              </span>
              <p className="product-sku">Stok: {product.stock ?? 'N/A'}</p>
            </div>
            <Link to="/catalog" className="back-link">
              ← Kembali ke katalog
            </Link>
          </div>
        </div>

        {/* Spesifikasi Produk */}
        <div className="product-spec-card" style={{ marginTop: 32, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ marginTop: 0 }}>Spesifikasi</h3>
          {product.specs ? (
            <pre style={{ background: '#f3f4f6', padding: 16, borderRadius: 8, fontSize: 15, color: '#374151', overflowX: 'auto' }}>{product.specs}</pre>
          ) : (
            <p style={{ color: '#6b7280' }}>Spesifikasi belum tersedia.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;
