// frontend/src/pages/StorePage.jsx
import React from 'react';

const branches = [
    {
        id: 1,
        name: 'SmartCheck Madiun HQ',
        address: 'Jl. Kutai No.5, Pandean, Kec. Taman, Kota Madiun',
        hours: '08.00 – 21.00',
        tag: 'Flagship Store'
    },
    {
        id: 2,
        name: 'SmartCheck Mall City',
        address: 'Lt. 2, City Mall, Jalur Utama Kota',
        hours: '10.00 – 22.00',
        tag: 'Mall Store'
    },
    {
        id: 3,
        name: 'SmartCheck Service Point',
        address: 'Ruko Tekno Center, Blok B-11',
        hours: '09.00 – 18.00',
        tag: 'Service & Drop Point'
    },
    {
        id: 4,
        name: 'SmartCheck Express Booth',
        address: 'Area kampus / event tertentu (rolling)',
        hours: 'Sesuai jadwal event',
        tag: 'Pop-up Booth'
    }
];

function StorePage() {
    return (
        <section className="info-section store-page">
            <div className="info-inner">
                <div className="info-header">
                    <div>
                        <p className="info-kicker">STORE</p>
                        <h2 className="info-title">Temukan Store SmartCheck Terdekat</h2>
                        <p className="info-lead">
                            SmartCheck hadir di beberapa titik strategis.
                            Kamu bisa datang untuk cek langsung gadget, konsultasi spek, ataupun
                            melakukan klaim proteksi dan service.
                        </p>
                    </div>
                    <div className="info-tags">
                        <span className="info-tag">Offline Experience</span>
                        <span className="info-tag">Service Center</span>
                        <span className="info-tag">Pop-up Event</span>
                    </div>
                </div>

                <div className="store-layout">
                    <div className="store-map">
                        <div className="store-map-header">
                            <span>Coverage Map</span>
                            <span>Jawa Timur & sekitarnya</span>
                        </div>
                        <div className="store-map-visual">
                            {/* Titik pin lokasi (dummy, hanya visual) */}
                            <span className="store-pin" />
                            <span className="store-pin" />
                            <span className="store-pin" />
                            <span className="store-pin" />
                        </div>
                        <p className="info-lead" style={{ marginTop: '0.9rem', fontSize: '0.85rem' }}>
                            Peta ini hanya ilustrasi. Data alamat detail bisa kamu update di database
                            seiring penambahan cabang baru.
                        </p>
                    </div>

                    <div className="store-list">
                        {branches.map((b) => (
                            <article key={b.id} className="store-item">
                                <div className="store-item-main">
                                    <h3>{b.name}</h3>
                                    <p>{b.address}</p>
                                    <p>Jam operasional: {b.hours}</p>
                                </div>
                                <span className="store-item-tag">{b.tag}</span>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default StorePage;
