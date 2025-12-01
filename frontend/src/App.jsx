import React, { useEffect, useState, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AppRouter from './router/AppRouter.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { API_BASE } from './api/config.js';

function App() {
  const [promos, setPromos] = useState([]);
  const [visitorCount, setVisitorCount] = useState(null);

  const loadPromos = useCallback(() => {
    fetch(`${API_BASE}/api/promos`)
      .then((res) => res.json())
      .then(setPromos)
      .catch((err) => console.error('Error load promos:', err));
  }, []);

  useEffect(() => {
    loadPromos();
  }, [loadPromos]);

  useEffect(() => {
    fetch(`${API_BASE}/api/visitor-count`)
      .then((res) => res.json())
      .then((data) => setVisitorCount(data.count))
      .catch((err) => console.error('Error load counter:', err));
  }, []);

  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main>
          <AppRouter promos={promos} reloadPromos={loadPromos} />
        </main>
        <Footer visitorCount={visitorCount} />
      </div>
    </AuthProvider>
  );
}

export default App;
