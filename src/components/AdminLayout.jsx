import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Candy, Receipt, LogOut, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/sweets', label: 'Manage Sweets', icon: Candy },
    { path: '/admin/billing', label: 'Billing', icon: Receipt },
  ];

  const sidebarStyles = {
    position: 'fixed',
    top: 0,
    left: isSidebarOpen ? 0 : '-280px',
    width: '280px',
    height: '100vh',
    backgroundColor: '#fff',
    borderRight: '1px solid #eee',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    transition: 'left 0.3s ease',
    boxShadow: isSidebarOpen ? '0 0 20px rgba(0,0,0,0.1)' : 'none'
  };

  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: isSidebarOpen ? 'block' : 'none',
    zIndex: 999
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f9f9', position: 'relative' }}>
      {/* Mobile Header */}
      <div style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, height: '60px', 
        backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--gold)', 
        display: 'flex', alignItems: 'center', padding: '0 1.5rem', 
        zIndex: 900 
      }} className="admin-mobile-header">
        <button onClick={() => setIsSidebarOpen(true)} style={{ color: 'var(--crimson)', padding: '5px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <Menu size={24} />
        </button>
        <h2 style={{ marginLeft: '1rem', color: 'var(--crimson)', fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 'bold' }}>Agra Admin</h2>
      </div>

      {/* Sidebar Overlay */}
      <div style={overlayStyles} onClick={() => setIsSidebarOpen(false)}></div>

      {/* Sidebar */}
      <aside style={{
        ...sidebarStyles,
        backgroundColor: 'var(--cream)',
        borderRight: '1px solid var(--gold)',
        // Override for desktop as static
        '@media (min-width: 1024px)': {
          position: 'sticky',
          left: 0,
          boxShadow: 'none'
        }
      }} className="admin-sidebar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ color: 'var(--crimson)', fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>Agra Sweets</h2>
          <button onClick={() => setIsSidebarOpen(false)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--crimson)', cursor: 'pointer' }} className="sidebar-close-btn">
            <X size={20} />
          </button>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', 
                  borderRadius: '10px', 
                  backgroundColor: isActive ? 'var(--crimson)' : 'transparent',
                  color: isActive ? '#fff' : '#333',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s',
                  textDecoration: 'none'
                }}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', color: '#ef4444', fontWeight: 600, marginTop: 'auto', border: 'none', background: 'none', cursor: 'pointer' }}>
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        padding: '2rem', 
        paddingTop: '80px', // Header offset
        overflowY: 'auto' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (min-width: 1024px) {
          .admin-sidebar {
            position: sticky !important;
            left: 0 !important;
            box-shadow: none !important;
          }
          .admin-mobile-header {
            display: none !important;
          }
          .admin-sidebar .sidebar-close-btn {
            display: none !important;
          }
          main {
            padding-top: 2rem !important;
          }
        }
        @media (max-width: 1023px) {
          .admin-sidebar .sidebar-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
