// src/components/WhyMaju.jsx
import React, { useState } from 'react';

const reasons = [
  {
    id: 1,
    label: 'Dealer Retail IT & Smartphone terpercaya.',
    title: 'Dealer resmi & terpercaya',
    detail:
      'SmartCheck hanya menjual produk resmi dengan garansi jelas. Customer bisa tenang karena setiap perangkat tercatat dan bisa dicek kembali riwayat pembeliannya.'
  },
  {
    id: 2,
    label: 'Partner resmi berbagai brand smartphone populer.',
    title: 'Partner brand-brand besar',
    detail:
      'Kami bekerja sama dengan brand smartphone dan laptop populer, sehingga update promo, launching seri baru, dan program trade-in bisa langsung terintegrasi ke sistem.'
  },
  {
    id: 3,
    label: 'Cabang di beberapa kota besar dengan lokasi strategis.',
    title: 'Jangkauan store yang mudah dijangkau',
    detail:
      'Lokasi store dipilih di area strategis seperti pusat kota, mall, dan dekat kampus sehingga pelanggan bisa datang langsung untuk experience produk.'
  },
  {
    id: 4,
    label: 'Informasi & promo selalu ter-update setiap bulan.',
    title: 'Promo selalu fresh',
    detail:
      'Tim marketing rutin mengupdate promo di sistem backend. Halaman Home & Promo pada website ini bisa menampilkan highlight terbaru secara real-time.'
  },
  {
    id: 5,
    label: 'Fasilitas pembayaran lengkap: tunai, kartu kredit, cicilan, e-wallet.',
    title: 'Banyak pilihan pembayaran',
    detail:
      'Dari tunai, kartu debit/kredit, cicilan 0%, sampai e-wallet, semuanya di-support supaya customer bebas memilih skema pembayaran yang paling nyaman.'
  },
  {
    id: 6,
    label: 'Layanan purna jual dan service center resmi.',
    title: 'After sales & service center',
    detail:
      'SmartCheck Care membantu proses klaim garansi, proteksi, dan service. Riwayat service bisa dihubungkan ke sistem agar lebih mudah dilacak.'
  },
  {
    id: 7,
    label: 'Banyak member setia yang memilih SmartCheck.',
    title: 'Komunitas member yang besar',
    detail:
      'Program membership dan promo khusus member bikin pelanggan betah. Ke depan, data member ini bisa dihubungkan dengan fitur notifikasi & voucher digital.'
  }
];

const stats = [
  { id: 1, number: '48+', label: 'Cabang & titik penjualan (simulasi)' },
  { id: 2, number: '80.000+', label: 'Member terdaftar dalam ekosistem' },
  { id: 3, number: '5+', label: 'Brand flagship partner utama' }
];

function WhyMaju() {
  const [activeId, setActiveId] = useState(reasons[0].id);
  const activeReason = reasons.find((r) => r.id === activeId);

  return (
    <section id="about" className="why-section">
      <div className="why-inner">
        {/* Galeri visual toko */}
        <div className="why-gallery">
          <div className="why-card large" />
          <div className="why-card small top" />
          <div className="why-card small bottom" />
        </div>

        {/* Konten utama */}
        <div className="why-content">
          <h2 className="section-title">Why SmartCheck ?</h2>
          <p className="why-lead">
            SmartCheck tidak hanya menjual gadget, tapi juga menyiapkan pengalaman lengkap:
            mulai dari pilihan produk, promo, proteksi, sampai layanan after sales yang rapi.
          </p>

          {/* Statistik kecil */}
          <div className="why-stats">
            {stats.map((s) => (
              <div key={s.id} className="why-stat-card">
                <span className="why-stat-number">{s.number}</span>
                <span className="why-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* List poin – bisa diklik */}
          <ul className="why-list">
            {reasons.map((r) => (
              <li
                key={r.id}
                className={activeId === r.id ? 'active' : ''}
                onClick={() => setActiveId(r.id)}
              >
                <span className="why-dot" />
                {r.label}
              </li>
            ))}
          </ul>

          {/* Panel penjelasan dinamis */}
          <div className="why-detail-panel">
            <h3>{activeReason.title}</h3>
            <p>{activeReason.detail}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyMaju;
