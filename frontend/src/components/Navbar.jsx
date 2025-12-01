import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-logo">
          <span className="logo-box">SC</span>
          <span className="logo-text">SmartCheck</span>
        </div>

        <button
          className={`nav-toggle circle ${open ? "open" : ""}`}
          onClick={() => setOpen(v => !v)}
        >
          <span className="line"></span>
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}
          onClick={() => setOpen(false)}>
          <Link to="/">Home</Link>
          <Link to="/catalog">Katalog</Link>
          <Link to="/about">About</Link>
          <Link to="/store">Store</Link>
          <Link to="/protection">Protection</Link>
          <Link to="/care">Care</Link>
          <Link to="/promo">Promo</Link>

          <div className="nav-auth">
            {user ? (
              <>
                <span className="nav-username">Hi, {user.name}</span>
                <Link to="/profil" className="nav-login-btn">
                  Profil
                </Link>
                <button
                  type="button"
                  className="nav-logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-login-btn">
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
