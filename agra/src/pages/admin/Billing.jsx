import React, { useEffect, useState } from 'react';
import { getSweets, getBills, saveBills } from '../../services/dataService';
import { Printer, X, ShoppingBag, Plus, Minus, TrendingUp, AlertCircle } from 'lucide-react';

const Billing = () => {
  const [sweets, setSweets] = useState([]);
  const [bills, setBills] = useState([]);
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalWeight, setModalWeight] = useState('price250');
  const [modalQty, setModalQty] = useState(1);
  const [currentBill, setCurrentBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const sweetsData = await getSweets();
      const billsData = await getBills();
      setSweets(sweetsData);
      setBills(billsData);
      setLoading(false);
    })();
  }, []);

  const openModal = (sweet) => {
    setSelectedSweet(sweet);
    setModalWeight('price250');
    setModalQty(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSweet(null);
  };

  const getModalTotal = () => {
    if (!selectedSweet) return 0;
    return selectedSweet[modalWeight] * modalQty;
  };

  const weightLabel = (key) => ({ price250: '250g', price500: '500g', price1000: '1kg' }[key]);

  const handleGenerate = () => {
    if (!selectedSweet) return;

    const newBill = {
      bill_id: Date.now(),
      sweet: selectedSweet.name,
      weight: weightLabel(modalWeight),
      qty: modalQty,
      price: selectedSweet[modalWeight],
      total: getModalTotal(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };

    const updatedBills = [newBill, ...bills];
    setBills(updatedBills);
    saveBills(updatedBills);
    setCurrentBill(newBill);
    closeModal();
    setTimeout(() => printBill(newBill), 500);
  };

  const printBill = (bill) => {
    const b = bill || currentBill;
    if (!b) return;

    const printWindow = window.open('', '', 'height=600,width=400');
    printWindow.document.write(`
      <html>
        <head>
          <title>POS Bill - Agra Sweets</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Courier New', Courier, monospace; margin: 0; padding: 20px; background: #fff; }
            .bill { max-width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { font-size: 24px; color: #B85C1A; margin-bottom: 5px; }
            .header p { font-size: 12px; color: #666; }
            .divider { border-top: 1px dashed #ccc; margin: 15px 0; }
            .info { font-size: 12px; margin-bottom: 15px; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            table { width: 100%; font-size: 13px; margin: 15px 0; }
            th, td { padding: 8px 0; text-align: left; }
            th { border-bottom: 1px solid #ccc; }
            .text-right { text-align: right; }
            .total { font-size: 16px; font-weight: bold; margin-top: 10px; }
            .footer { text-align: center; margin-top: 20px; font-size: 11px; color: #666; }
            .thankyou { text-align: center; margin-top: 15px; font-size: 14px; font-weight: bold; color: #B85C1A; }
          </style>
        </head>
        <body>
          <div class="bill">
            <div class="header">
              <h1>AGRA SWEETS</h1>
              <p>Premium Quality Sweets</p>
              <p>Since 1985</p>
            </div>
            <div class="divider"></div>
            <div class="info">
              <div class="info-row">
                <span>Bill No:</span>
                <span>#${String(b.bill_id).slice(-8)}</span>
              </div>
              <div class="info-row">
                <span>Date:</span>
                <span>${b.date} ${b.time}</span>
              </div>
            </div>
            <div class="divider"></div>
            <table>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th class="text-right">Total</th>
              </tr>
              <tr>
                <td>${b.sweet} (${b.weight})</td>
                <td>${b.qty}</td>
                <td class="text-right">₹${b.total}</td>
              </tr>
            </table>
            <div class="divider"></div>
            <div class="info-row total">
              <span>GRAND TOTAL</span>
              <span class="text-right">₹${b.total}</span>
            </div>
            <div class="divider"></div>
            <div class="thankyou">✨ Thank you! ✨</div>
            <div class="footer">Visit Again :)</div>
          </div>
        </body>
      </html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
  };

  const totalRevenue = bills.reduce((sum, bill) => sum + (bill.total || 0), 0);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: '800', color: '#2D2D2D', marginBottom: '8px' }}>Billing & POS</h1>
        <p style={{ color: '#7A7A7A' }}>Select a sweet, configure quantity, and generate bills</p>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #fff 0%, #FFF8F0 100%)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(184,92,26,0.1)' }}>
          <TrendingUp size={24} color="#B85C1A" style={{ marginBottom: '8px' }} />
          <p style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '4px' }}>Total Revenue</p>
          <p style={{ fontSize: '24px', fontWeight: '800', color: '#B85C1A' }}>₹{totalRevenue}</p>
        </div>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #F0E0D0' }}>
          <ShoppingBag size={24} color="#3B82F6" style={{ marginBottom: '8px' }} />
          <p style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '4px' }}>Total Bills</p>
          <p style={{ fontSize: '24px', fontWeight: '800', color: '#2D2D2D' }}>{bills.length}</p>
        </div>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #F0E0D0' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🍬</div>
          <p style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '4px' }}>Available Sweets</p>
          <p style={{ fontSize: '24px', fontWeight: '800', color: '#2D2D2D' }}>{sweets.length}</p>
        </div>
      </div>

      {/* Sweets Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#7A7A7A' }}>Loading sweets...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {sweets.map(sweet => (
            <button
              key={sweet.id}
              onClick={() => openModal(sweet)}
              style={{
                textAlign: 'left',
                padding: 0,
                border: '2px solid #F0E0D0',
                borderRadius: '20px',
                overflow: 'hidden',
                background: '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#B85C1A';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#F0E0D0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFEFE0 100%)', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {sweet.image ? (
                  <img src={sweet.image} alt={sweet.name} style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '3.5rem' }}>🍬</span>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#2D2D2D', marginBottom: '8px' }}>{sweet.name}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#B85C1A', fontWeight: '700', fontSize: '18px' }}>₹{sweet.price250}</span>
                  <span style={{ fontSize: '12px', color: '#7A7A7A' }}>/250g</span>
                </div>
              </div>
            </button>
          ))}

          {sweets.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '20px', color: '#7A7A7A', border: '2px dashed #F0E0D0', gridColumn: '1 / -1' }}>
              <AlertCircle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>No sweets available. Please add sweets in Manage Sweets first.</p>
            </div>
          )}
        </div>
      )}

      {/* Recent Bills */}
      {bills.length > 0 && (
        <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '20px 24px 0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#2D2D2D', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={20} color="#B85C1A" /> Recent Transactions
            </h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9F9F9', borderBottom: '1px solid #F0E0D0' }}>
                  {['Bill No', 'Sweet', 'Weight', 'Qty', 'Total', 'Date', 'Action'].map(h => (
                    <th key={h} style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bills.slice(0, 10).map(bill => (
                  <tr key={bill.bill_id} style={{ borderBottom: '1px solid #F0E0D0' }}>
                    <td style={{ padding: '16px', fontSize: '13px', color: '#666' }}>#{String(bill.bill_id).slice(-6)}</td>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#2D2D2D' }}>{bill.sweet}</td>
                    <td style={{ padding: '16px', fontSize: '13px', color: '#666' }}>{bill.weight}</td>
                    <td style={{ padding: '16px', fontSize: '13px', color: '#666', textAlign: 'center' }}>{bill.qty}</td>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#B85C1A' }}>₹{bill.total}</td>
                    <td style={{ padding: '16px', fontSize: '12px', color: '#999' }}>{bill.date}</td>
                    <td style={{ padding: '16px' }}>
                      <button onClick={() => printBill(bill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B85C1A', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600' }}>
                        <Printer size={14} /> Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedSweet && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'modalSlideIn 0.3s ease' }}>
            {/* Header */}
            <div style={{ position: 'relative', background: 'linear-gradient(135deg, #FFF8F0 0%, #FFEFE0 100%)', padding: '32px', textAlign: 'center' }}>
              <button onClick={closeModal} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} />
              </button>
              {selectedSweet.image ? (
                <img src={selectedSweet.image} alt={selectedSweet.name} style={{ height: '100px', objectFit: 'contain' }} />
              ) : (
                <div style={{ fontSize: '4rem' }}>🍬</div>
              )}
              <h2 style={{ marginTop: '12px', fontSize: '24px', fontWeight: '800', color: '#B85C1A' }}>{selectedSweet.name}</h2>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
              {/* Weight Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4A4A4A' }}>Select Weight</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {['price250', 'price500', 'price1000'].map(key => (
                    <button
                      key={key}
                      onClick={() => setModalWeight(key)}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: `2px solid ${modalWeight === key ? '#B85C1A' : '#E5E5E5'}`,
                        background: modalWeight === key ? 'rgba(184,92,26,0.1)' : '#fff',
                        fontWeight: '700',
                        color: modalWeight === key ? '#B85C1A' : '#666',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '14px', marginBottom: '4px' }}>{weightLabel(key)}</div>
                      <div style={{ fontSize: '18px' }}>₹{selectedSweet[key]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4A4A4A' }}>Quantity</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button onClick={() => setModalQty(q => Math.max(1, q - 1))} style={{ width: '44px', height: '44px', borderRadius: '12px', border: '2px solid #E5E5E5', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Minus size={20} />
                  </button>
                  <input type="number" min="1" value={modalQty} onChange={e => setModalQty(Math.max(1, Number(e.target.value)))} style={{ width: '80px', textAlign: 'center', padding: '12px', border: '2px solid #E5E5E5', borderRadius: '12px', fontSize: '18px', fontWeight: '700' }} />
                  <button onClick={() => setModalQty(q => q + 1)} style={{ width: '44px', height: '44px', borderRadius: '12px', border: '2px solid #B85C1A', background: '#B85C1A', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFEFE0 100%)', borderRadius: '16px', padding: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: '#4A4A4A' }}>Total Amount</span>
                <span style={{ fontSize: '32px', fontWeight: '800', color: '#B85C1A' }}>₹{getModalTotal()}</span>
              </div>

              <button onClick={handleGenerate} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #B85C1A 0%, #E87A2A 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Printer size={20} /> Generate & Print Bill
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 640px) {
          .stats-card {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Billing;