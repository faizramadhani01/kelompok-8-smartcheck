// src/components/Footer.jsx
import React from 'react';

function Footer({ visitorCount }) {
  const quickLinks = ['Home', 'Katalog', 'Promo', 'Store', 'Protection', 'Care', 'About Us'];

  return (
    <footer className="footer">
      {/* garis kecil gradient di atas footer */}
      <div className="footer-accent" />

      <div className="footer-inner">
        {/* Brand + alamat */}
        <div className="footer-col footer-brand">
          <div className="footer-logo-row">
            <span className="logo-box">SC</span>
            <span className="logo-text">SmartCheck</span>
          </div>
          <p className="footer-tagline">
            Retail IT &amp; smartphone dengan promo lengkap, proteksi perangkat,
            dan layanan after sales yang rapi.
          </p>
          <p className="footer-heading">HQ SmartCheck</p>
          <p>Jl. Kutai No.5, Pandean, Kec. Taman</p>
          <p>Kota Madiun, Jawa Timur 63133</p>
        </div>

        {/* Jam buka */}
        <div className="footer-col">
          <h4 className="footer-heading">Jam Buka Store</h4>
          <p>Senin – Minggu</p>
          <p>08:00 – 21:00</p>
          <div className="footer-chip-row">
            <span className="footer-chip">Walk-in &amp; Booking</span>
          </div>
        </div>

        {/* Sosmed */}
        <div className="footer-col">
          <h4 className="footer-heading">Follow Us</h4>
          <p className="footer-subtext">
            Ikuti SmartCheck untuk info promo dan launching produk baru.
          </p>
          <div className="footer-social-row">
            <span className="footer-social-pill">YouTube</span>
            <span className="footer-social-pill">Facebook</span>
            <span className="footer-social-pill">Instagram</span>
            <span className="footer-social-pill">TikTok</span>
          </div>
        </div>

        {/* Metode pembayaran */}
        <div className="footer-col">
          <h4 className="footer-heading">Pembayaran</h4>
          <p className="footer-subtext">Dukungan beragam metode cashless.</p>
          <div className="payment-strip">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Gopay</span>
            <span>Shopeepay</span>
            <span>OVO</span>
          </div>
          <div className="payment-strip second">
            <span>Bank Transfer</span>
            <span>Cicilan 0%</span>
          </div>
        </div>

        {/* Visitor counter */}
        <div className="footer-col footer-counter">
          <h4 className="footer-heading">Visitor Counter</h4>
          <p className="footer-subtext">Pengunjung web SmartCheck.</p>
          <div className="counter-box">{visitorCount ?? '…'}</div>
          <p className="footer-subtext small">
            Counter ini bertambah setiap kali halaman dibuka.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="footer-bottom-links">
            {quickLinks.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <span className="footer-bottom-copy">
            COPYRIGHT © 2024 • SMARTCHECK.ID
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
