import React, { useEffect, useState } from 'react';

const slides = [
  {
    id: 1,
    themeClass: 'theme-oppo',
    tagline: 'MAJU HARDWARE • OFFICIAL PARTNER',
    headline: 'OPPO',
    subHeadline: 'Find X Series',
    description: '200MP Super Zoom • 4K 120fps • 7500 mAh Battery',
    badges: [
      { label: 'Ready Stock' },
      { label: 'Cicilan 0% hingga 24x', outline: true }
    ],
    offers: [
      { label: 'FIND X9', spec: 'RAM 12GB • ROM 256GB', price: 'Rp 14.999.000' },
      {
        label: 'FIND X9 Pro',
        spec: 'RAM 16GB • ROM 512GB',
        price: 'Rp 16.999.000',
        alt: true
      }
    ],
    images: [
      'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5077042/pexels-photo-5077042.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
  },
  {
    id: 2,
    themeClass: 'theme-iphone',
    tagline: 'APPLE AUTHORIZED RESELLER',
    headline: 'iPhone 17',
    subHeadline: 'Series',
    description: 'Dynamic Island • ProMotion • Kamera sinematik 48MP.',
    badges: [
      { label: 'Trade-in Spesial' },
      { label: 'Free Proteksi 1 Tahun', outline: true }
    ],
    offers: [
      { label: 'iPhone 17', spec: '128GB • Resmi iBox', price: 'Rp 15.999.000' },
      {
        label: 'iPhone 17 Pro',
        spec: '256GB • Titanium Frame',
        price: 'Rp 20.499.000',
        alt: true
      }
    ],
    images: [
      '/images/hero/iphone17-front.png',
      '/images/hero/iphone17-back.png',
    ],
  },
  {
    id: 3,
    themeClass: 'theme-xiaomi',
    tagline: 'GAMING PERFORMANCE SERIES',
    headline: 'Xiaomi',
    subHeadline: '15T Series',
    description: 'Layar 144Hz • Snapdragon kencang • Baterai tahan seharian.',
    badges: [
      { label: 'Bonus Gaming Giftpack' },
      { label: 'Gratis Ongkir Jawa Timur', outline: true }
    ],
    offers: [
      { label: '15T', spec: 'RAM 12GB • ROM 256GB', price: 'Rp 5.499.000' },
      {
        label: '15T Pro',
        spec: 'RAM 16GB • ROM 512GB',
        price: 'Rp 6.799.000',
        alt: true
      }
    ],
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5077042/pexels-photo-5077042.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
  }
];

function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % slides.length),
      6000
    );
    return () => clearInterval(id);
  }, []);

  const current = slides[index];

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <section className={`hero ${current.themeClass}`}>
      <div className="hero-gradient" />

      {/* key = current.id → tiap ganti slide, animasi slomo jalan */}
      <div key={current.id} className="hero-inner hero-inner-anim">
        <div className="hero-left">
          <p className="hero-tag">{current.tagline}</p>
          <h1 className="hero-title">
            {current.headline}
            <span>{current.subHeadline}</span>
          </h1>
          <p className="hero-subtitle">{current.description}</p>

          <div className="hero-badges">
            {current.badges.map((b) => (
              <span
                key={b.label}
                className={`badge ${b.outline ? 'badge-outline' : ''}`}
              >
                {b.label}
              </span>
            ))}
          </div>

          <div className="hero-price-row">
            {current.offers.map((offer) => (
              <div
                key={offer.label}
                className={`hero-price-card ${offer.alt ? 'alt' : ''}`}
              >
                <span className="hero-price-label">{offer.label}</span>
                <span className="hero-price-spec">{offer.spec}</span>
                <span className="hero-price">{offer.price}</span>
              </div>
            ))}
          </div>

          
        </div>

        <div className="hero-right">
          <div
            className="phone phone-left phone-anim"
            style={
              current.images?.[0]
                ? { backgroundImage: `url(${current.images[0]})` }
                : {}
            }
          />
          <div
            className="phone phone-right phone-anim"
            style={
              current.images?.[1]
                ? { backgroundImage: `url(${current.images[1]})` }
                : {}
            }
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSlider;
