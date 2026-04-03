import React, { useEffect, useState } from 'react';
import { getSweets, getBills } from '../../services/dataService';
import { IndianRupee, Candy, TrendingUp, ShoppingBag, Users, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ sweetsCount: 0, totalSales: 0, billsCount: 0 });
  const [recentBills, setRecentBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const sweets = await getSweets();
      const bills = await getBills();

      const totalSales = bills.reduce((acc, curr) => acc + (curr.total || 0), 0);

      // Get recent 5 bills
      const recent = [...bills].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

      setStats({
        sweetsCount: sweets.length,
        totalSales,
        billsCount: bills.length
      });
      setRecentBills(recent);
      setLoading(false);
    };
    loadStats();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 36px)',
          fontWeight: '800',
          color: '#2D2D2D',
          marginBottom: '8px',
          fontFamily: "'Playfair Display', serif"
        }}>
          Dashboard Overview
        </h1>
        <p style={{ color: '#7A7A7A', fontSize: '15px' }}>
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Total Sales Card */}
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #fff 0%, #FFF8F0 100%)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer',
          border: '1px solid rgba(184,92,26,0.1)'
        }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#B85C1A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Sales
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '800', color: '#2D2D2D', margin: 0 }}>
              {formatCurrency(stats.totalSales)}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
              <ArrowUp size={16} color="#10b981" />
              <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '600' }}>+12.5%</span>
              <span style={{ fontSize: '13px', color: '#7A7A7A' }}>from last month</span>
            </div>
          </div>
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, rgba(184,92,26,0.1) 0%, rgba(232,122,42,0.1) 100%)',
            borderRadius: '16px'
          }}>
            <IndianRupee size={40} color="#B85C1A" />
          </div>
        </div>

        {/* Total Sweets Card */}
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #fff 0%, #F0F9FF 100%)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer',
          border: '1px solid rgba(59,130,246,0.1)'
        }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#3B82F6', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Sweets Listed
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '800', color: '#2D2D2D', margin: 0 }}>
              {stats.sweetsCount}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
              <ShoppingBag size={16} color="#7A7A7A" />
              <span style={{ fontSize: '13px', color: '#7A7A7A' }}>Active products</span>
            </div>
          </div>
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(96,165,250,0.1) 100%)',
            borderRadius: '16px'
          }}>
            <Candy size={40} color="#3B82F6" />
          </div>
        </div>

        {/* Total Bills Card */}
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #fff 0%, #F0FDF4 100%)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer',
          border: '1px solid rgba(16,185,129,0.1)'
        }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#10B981', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Bills Generated
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '800', color: '#2D2D2D', margin: 0 }}>
              {stats.billsCount}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
              <Users size={16} color="#7A7A7A" />
              <span style={{ fontSize: '13px', color: '#7A7A7A' }}>Total transactions</span>
            </div>
          </div>
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(52,211,153,0.1) 100%)',
            borderRadius: '16px'
          }}>
            <TrendingUp size={40} color="#10B981" />
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Recent Bills */}
        <div className="card" style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid #F0E0D0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2D2D2D', margin: 0 }}>Recent Bills</h3>
            <Calendar size={20} color="#B85C1A" />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7A7A7A' }}>
              Loading recent bills...
            </div>
          ) : recentBills.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentBills.map((bill, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: index !== recentBills.length - 1 ? '1px solid #F0E0D0' : 'none'
                }}>
                  <div>
                    <p style={{ fontWeight: '600', color: '#2D2D2D', marginBottom: '4px' }}>
                      Bill #{bill.id || index + 1}
                    </p>
                    <p style={{ fontSize: '12px', color: '#7A7A7A' }}>
                      {formatDate(bill.date || new Date())}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '700', color: '#B85C1A', marginBottom: '4px' }}>
                      {formatCurrency(bill.total || 0)}
                    </p>
                    <p style={{ fontSize: '11px', color: '#7A7A7A' }}>
                      {bill.items?.length || 0} items
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7A7A7A' }}>
              No bills generated yet
            </div>
          )}
        </div>

        {/* Quick Actions / Welcome Message */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #B85C1A 0%, #E87A2A 100%)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          color: '#fff'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <ShoppingBag size={28} color="#fff" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
              Welcome to Admin Portal
            </h3>
            <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.5' }}>
              Navigate using the sidebar to manage sweets, generate bills, and track your store's performance.
            </p>
          </div>
          <div style={{
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            fontSize: '13px',
            opacity: 0.8
          }}>
            💡 Tip: Use the "Generate Bill" feature to create new invoices for customers
          </div>
        </div>
      </div>

      <style>{`
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
          .stat-card {
            padding: 20px !important;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .stat-card, .card {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;