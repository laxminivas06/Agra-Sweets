import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, UserCircle, Lock, MoreVertical, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';
import Footer from './Footer';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Auto-close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="browser-wrap">

      {/* Browser Bar */}
      <div className="browser-bar">
        <div className="dots">
          <div className="dot dot-red"></div>
          <div className="dot dot-yellow"></div>
          <div className="dot dot-green"></div>
        </div>
        <div className="tab">
          <div className="tab-icon"></div>
          Agra Sweets
          <span className="tab-close">✕</span>
        </div>
        <span className="add-tab" style={{ marginLeft: '4px' }}>+</span>
      </div>

      <div className="address-bar">
        <div className="nav-arrows">
          <button className="nav-btn"><ArrowLeft size={16} /></button>
          <button className="nav-btn"><ArrowRight size={16} /></button>
          <button className="nav-btn"><RotateCw size={16} /></button>
        </div>
        <div className="url-text">
          <span>Agrasweets.com</span>
        </div>
      </div>

      {/* Website Content */}
      <div className="site">
        <header className="main-header">
          {/* Desktop Left Nav */}
          <nav className="desktop-only" style={{ flex: 1 }}>
            <ul className="nav-links">
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><a href="/#collection" className="nav-link">Sweets</a></li>
              <li><a href="/#about" className="nav-link">About Us</a></li>
            </ul>
          </nav>

          {/* Logo Center */}
          <Link to="/" style={{ textDecoration: 'none' }} className="logo-wrap">
            <div className="logo-dots" style={{ color: 'var(--crimson)' }}>· · · · · · · · · · · · · ·</div>
            <div className="logo-box"> AGRA · SWEETS</div>
            <div className="logo-sub" style={{ color: 'var(--crimson)' }}>· · · · · · · · · · · · · ·</div>
          </Link>

          {/* Desktop Right Nav & Icons */}
          <div className="desktop-only" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '32px' }}>
            <Link to="/admin/login" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserCircle size={16} />
            </Link>

          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" onClick={toggleMenu} style={{ background: 'none', border: 'none', color: 'var(--crimson)', cursor: 'pointer' }}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`} style={{
          position: 'fixed', top: '0', right: isMenuOpen ? '0' : '-100%', width: '85%', maxWidth: '320px', height: '100vh', background: 'linear-gradient(145deg, var(--crimson) 0%, var(--dark-red) 100%)',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.6)', transition: 'right 0.35s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 1002, display: 'flex', flexDirection: 'column'
        }}>
          {/* Menu Header with Close Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '25px' }}>
            <button onClick={toggleMenu} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '50%', border: 'none', color: 'var(--gold)', cursor: 'pointer', padding: '8px', display: 'flex' }}>
              <X size={24} />
            </button>
          </div>

          <div style={{ padding: '0 40px', display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '20px' }}>
            <Link to="/" className="mobile-nav-link" onClick={toggleMenu}>Home</Link>
            <a href="/#collection" className="mobile-nav-link" onClick={toggleMenu}>Sweets</a>
            <a href="/#about" className="mobile-nav-link" onClick={toggleMenu}>About Us</a>

            <div style={{ height: '1px', background: 'var(--gold)', opacity: 0.3, margin: '15px 0' }}></div>

            <Link to="/admin/login" className="mobile-nav-link admin-nav-link" onClick={toggleMenu}>
              <UserCircle size={22} style={{ marginRight: '10px' }} />
            </Link>
          </div>

          {/* Decorative bottom */}
          <div style={{ marginTop: 'auto', padding: '40px', textAlign: 'center' }}>
            <div className="logo-box" style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', display: 'inline-block' }}>AGRA · SWEETS</div>
          </div>
        </div>

        {isMenuOpen && (
          <div onClick={toggleMenu} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1001 }}></div>
        )}

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </main>

        <Footer />
      </div>

      <style>{`
        .desktop-only { display: flex; }
        .mobile-menu-btn { display: none; }
        
        .mobile-nav-link {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: var(--cream);
          text-decoration: none;
          font-weight: 700;
          display: flex;
          align-items: center;
          transition: transform 0.2s, color 0.2s;
        }
        
        .mobile-nav-link:hover, .mobile-nav-link:active {
          color: var(--gold);
          transform: translateX(10px);
        }

        .admin-nav-link {
          font-size: 1.3rem;
          color: var(--gold);
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
        }
        
        @media (max-width: 900px) {
          .desktop-only { display: none !important; }
          .mobile-menu-btn { display: block; }
          .logo-wrap { order: -1; }
        }

        .mobile-nav.open { right: 0 !important; }
      `}</style>
    </div>
  );
};

export default Layout;