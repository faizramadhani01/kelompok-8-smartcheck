import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import CatalogPage from '../pages/CatalogPage.jsx';
import ProductDetailPage from '../pages/ProductDetailPage.jsx';
import PromoPage from '../pages/PromoPage.jsx';
import StorePage from '../pages/StorePage.jsx';
import ProtectionPage from '../pages/ProtectionPage.jsx';
import CarePage from '../pages/CarePage.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import ProfilePage from '../pages/ProfilPage.jsx';
import AdminDashboardPage from '../pages/AdminDashboardPage.jsx';
import AdminRoute from './AdminRoute.jsx';

function AppRouter({ promos, reloadPromos }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage promos={promos} />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/catalog/:id" element={<ProductDetailPage />} />
      <Route path="/promo" element={<PromoPage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/protection" element={<ProtectionPage />} />
      <Route path="/care" element={<CarePage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profil" element={<ProfilePage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
      </Route>

    </Routes>
  );
}

export default AppRouter;
