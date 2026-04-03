import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSweetByQR } from '../services/dataService';
import { ArrowLeft, Clock, Calendar, CheckCircle2, Play } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const SweetDetail = () => {
  const { id } = useParams();
  const [sweet, setSweet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSweet = async () => {
      const data = await getSweetByQR(id);
      setSweet(data);
      setLoading(false);
    };
    loadSweet();
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍬</div>
        <p className="text-muted">Loading sweet details...</p>
      </div>
    </div>
  );

  if (!sweet) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😕</div>
      <h2>Sweet not found</h2>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>This QR code doesn't match any sweet in our catalog.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );

  const isYoutube = sweet.video && (sweet.video.includes('youtube.com') || sweet.video.includes('youtu.be'));
  const getYoutubeEmbedUrl = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to Sweets
      </Link>

      {/* Hero Card */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* Image Panel */}
          <div style={{ flex: '1 1 320px', minHeight: '340px', background: 'linear-gradient(135deg, #fef9f0 0%, #fde8c0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', top: '-80px', right: '-80px' }} />
            <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', bottom: '-60px', left: '-60px' }} />
            {sweet.image ? (
              <img
                src={sweet.image}
                alt={sweet.name}
                style={{ maxWidth: '280px', maxHeight: '280px', objectFit: 'contain', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))', zIndex: 1, transition: 'transform 0.5s ease', position: 'relative' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
              />
            ) : (
              <div style={{ fontSize: '8rem', filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.15))', zIndex: 1 }}>🍬</div>
            )}
          </div>

          {/* Detail Panel */}
          <div style={{ flex: '1 1 320px', padding: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '0.75rem', lineHeight: 1.2 }}>{sweet.name}</h1>
            <p className="text-muted" style={{ marginBottom: '2rem', lineHeight: 1.7, fontSize: '1rem' }}>{sweet.description}</p>

            {/* Prices Table */}
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: 'var(--primary-color)', padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'white', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>Weight</span>
                <span style={{ color: 'white', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>Price</span>
              </div>
              {[{ label: '250g', price: sweet.price250 }, { label: '500g', price: sweet.price500 }, { label: '1kg', price: sweet.price1000 }].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.875rem 1.25rem', backgroundColor: i % 2 === 0 ? '#fafafa' : 'white', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: 500 }}>{item.label}</span>
                  <strong style={{ color: 'var(--primary-dark)', fontSize: '1.1rem' }}>₹{item.price}</strong>
                </div>
              ))}
            </div>

            {/* Dates */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0', flex: '1 1 140px' }}>
                <Calendar size={20} color="#16a34a" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>Manufacture</div>
                  <div style={{ fontWeight: 600, color: '#1f2937' }}>{new Date(sweet.manufacture).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-md)', border: '1px solid #fecaca', flex: '1 1 140px' }}>
                <Clock size={20} color="#dc2626" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>Expiry Date</div>
                  <div style={{ fontWeight: 600, color: '#1f2937' }}>{new Date(sweet.expiry).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Quality badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 600 }}>
              <CheckCircle2 size={20} />
              <span>100% Pure Ingredients. No Adulteration.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video + QR Row */}
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {/* Video */}
        {sweet.video && (
          <div className="card" style={{ flex: '1 1 320px', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 1.5rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Play size={20} color="var(--primary-color)" />
              <h3>Making Process</h3>
            </div>
            {isYoutube ? (
              <iframe
                src={getYoutubeEmbedUrl(sweet.video)}
                style={{ width: '100%', height: '240px', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${sweet.name} making process`}
              />
            ) : (
              <video src={sweet.video} controls style={{ width: '100%', height: '240px', backgroundColor: '#000' }} />
            )}
          </div>
        )}

        {/* QR Code */}
        <div className="card" style={{ flex: '0 1 260px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'linear-gradient(135deg, #fef9f0, #fde8c0)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>Scan QR Code</h3>
          <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', border: '3px solid var(--primary-color)', marginBottom: '1rem' }}>
            <QRCodeSVG value={`${window.location.origin}/sweet/${sweet.qr}`} size={120} />
          </div>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Scan to view <strong>{sweet.name}</strong> details instantly</p>
        </div>
      </div>
    </div>
  );
};

export default SweetDetail;
